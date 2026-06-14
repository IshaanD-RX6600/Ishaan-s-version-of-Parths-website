'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Sky, Html } from '@react-three/drei'
import * as THREE from 'three'

import { useJourney, ISLANDS, BOAT, FLOAT_Y, LABEL_Y, DOCK_RADIUS, START, input, resumeState, boatState } from './Journey'
import { isBlocked, buildOccupancy, WORLD_BOUND } from './islandCollision'

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const ISLAND_GLB = `${BASE}/islands.glb`
const BOAT_GLB = `${BASE}/${BOAT.glb}`

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

// The boat's hull occupies more than a point — sample bow, centre and stern so
// it can't nose into an island before its centre cell registers a hit.
function hullBlocked(cx, cz, yaw) {
  const fx = Math.sin(yaw)
  const fz = Math.cos(yaw)
  const L = BOAT.hullHalf
  return isBlocked(cx, cz) || isBlocked(cx + fx * L, cz + fz * L) || isBlocked(cx - fx * L, cz - fz * L)
}

// Repulsion so the boat can never rest against land: sample a ring at the
// clearance radius and return a unit vector pointing away from any nearby
// island cells (null when there's open water all around).
function repel(x, z) {
  let px = 0
  let pz = 0
  let hits = 0
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    const dx = Math.cos(a)
    const dz = Math.sin(a)
    if (isBlocked(x + dx * BOAT.clearance, z + dz * BOAT.clearance)) {
      px -= dx
      pz -= dz
      hits++
    }
  }
  if (!hits) return null
  const len = Math.hypot(px, pz) || 1
  return { px: px / len, pz: pz / len }
}

function nearestDock(x, z) {
  let best = null
  let bd = DOCK_RADIUS * DOCK_RADIUS
  for (const island of ISLANDS) {
    const dx = x - island.berth[0]
    const dz = z - island.berth[1]
    const d = dx * dx + dz * dz
    if (d < bd) {
      bd = d
      best = island.key
    }
  }
  return best
}

// ─── Animated procedural ocean ───────────────────────────────────────────────
function Ocean() {
  const mesh = useRef()

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const pos = mesh.current.geometry.attributes.position
    const t = clock.elapsedTime

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getY(i)
      const h =
        Math.sin(x * 0.16 + t * 0.85) * 0.28 +
        Math.sin(z * 0.21 + t * 0.65) * 0.20 +
        Math.sin((x - z) * 0.11 + t * 1.15) * 0.14 +
        Math.sin((x + z) * 0.07 + t * 0.45) * 0.09
      pos.setZ(i, h)
    }
    pos.needsUpdate = true
    mesh.current.geometry.computeVertexNormals()
  })

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.6, 0]} renderOrder={-1}>
      <planeGeometry args={[500, 500, 72, 72]} />
      <meshStandardMaterial
        color="#5abecf"
        roughness={0.08}
        metalness={0.9}
        transparent
        opacity={0.96}
        depthWrite={false}
      />
    </mesh>
  )
}

// ─── Island GLB ───────────────────────────────────────────────────────────────
function IslandModel() {
  const { scene } = useGLTF(ISLAND_GLB)
  const ref = useRef()

  // Bake the collision mask from the real, placed mesh once it's mounted (next
  // tick, so the intro can paint first). Guarantees the wall matches the rock.
  useEffect(() => {
    const id = setTimeout(() => {
      if (ref.current) buildOccupancy(ref.current)
    }, 0)
    return () => clearTimeout(id)
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.position.y = -1.9 + Math.sin(clock.elapsedTime * 0.28 + 1.1) * 0.04
  })

  return <primitive ref={ref} object={scene} scale={[1.8, 1.8, 1.8]} position={[0, -1.9, 0]} />
}

// ─── Sailboat — free roam with WASD / arrows + island collision ───────────────
function Boat() {
  const { scene } = useGLTF(BOAT_GLB)
  const group = useRef()
  const x = useRef(START.x)
  const z = useRef(START.z)
  const yaw = useRef(START.yaw)
  const speed = useRef(0)
  const lastNear = useRef(null)
  const { active, paused, reportNear } = useJourney()

  // Every time the journey (re)starts, drop the boat back at START (open water
  // near the bottom of the map) — OR, when the visitor came back via the
  // "continue sailing" arrow, just off the island they were exploring
  // (`resumeState.spawn`). We only read it here; the provider clears it after.
  useEffect(() => {
    if (!active) return
    const spawn = resumeState.spawn || START
    x.current = spawn.x
    z.current = spawn.z
    yaw.current = spawn.yaw
    speed.current = 0
    boatState.x = spawn.x
    boatState.z = spawn.z
    boatState.yaw = spawn.yaw
    boatState.y = FLOAT_Y
  }, [active])

  useFrame(({ clock }, delta) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(delta, 0.05)
    const k = input.keys
    const frozen = paused || !active

    // Steering + throttle from held keys.
    let turn = 0
    let throttle = 0
    if (!frozen) {
      if (k.KeyA || k.ArrowLeft) turn += 1
      if (k.KeyD || k.ArrowRight) turn -= 1
      if (k.KeyW || k.ArrowUp) throttle += 1
      if (k.KeyS || k.ArrowDown) throttle -= 1
    }

    yaw.current += turn * BOAT.turnSpeed * dt
    speed.current += (throttle * BOAT.moveSpeed - speed.current) * Math.min(1, dt * 3)
    if (Math.abs(speed.current) < 0.002) speed.current = 0

    // Proposed displacement along the heading.
    const fx = Math.sin(yaw.current)
    const fz = Math.cos(yaw.current)
    const vx = fx * speed.current * dt
    const vz = fz * speed.current * dt
    let nx = x.current + vx
    let nz = z.current + vz

    // Solid islands: try the full move, else slide along one axis, else stop.
    if (hullBlocked(nx, nz, yaw.current)) {
      if (!hullBlocked(x.current + vx, z.current, yaw.current)) {
        nx = x.current + vx
        nz = z.current
      } else if (!hullBlocked(x.current, z.current + vz, yaw.current)) {
        nx = x.current
        nz = z.current + vz
      } else {
        nx = x.current
        nz = z.current
        speed.current = 0
      }
    }

    x.current = clamp(nx, -WORLD_BOUND, WORLD_BOUND)
    z.current = clamp(nz, -WORLD_BOUND, WORLD_BOUND)

    // Keep a standoff from every shore: while playing, shove the hull off any
    // island it drifts too close to so it can never stay in contact.
    if (!frozen) {
      const push = repel(x.current, z.current)
      if (push) {
        const step = BOAT.pushStrength * dt
        const rx = clamp(x.current + push.px * step, -WORLD_BOUND, WORLD_BOUND)
        const rz = clamp(z.current + push.pz * step, -WORLD_BOUND, WORLD_BOUND)
        if (!hullBlocked(rx, rz, yaw.current)) {
          x.current = rx
          z.current = rz
        }
        speed.current *= 0.5
      }
    }

    g.position.x = x.current
    g.position.z = z.current
    g.position.y = FLOAT_Y + Math.sin(clock.elapsedTime * 1.1) * 0.13
    g.rotation.y = yaw.current + BOAT.baseYaw
    g.rotation.z = Math.sin(clock.elapsedTime * 0.9) * 0.03 - turn * 0.12 // lean into turns

    boatState.x = x.current
    boatState.z = z.current
    boatState.y = g.position.y
    boatState.yaw = yaw.current

    // Tell the UI which island (if any) is now in docking range.
    const dock = active ? nearestDock(x.current, z.current) : null
    if (dock !== lastNear.current) {
      lastNear.current = dock
      reportNear(dock)
    }
  })

  return (
    <primitive
      ref={group}
      object={scene}
      scale={BOAT.scale}
      position={[ISLANDS[0].berth[0], FLOAT_Y, ISLANDS[0].berth[1]]}
    />
  )
}

// ─── Floating island labels (display only) ────────────────────────────────────
function IslandLabels() {
  return (
    <>
      {ISLANDS.map((island) => (
        <Html
          key={island.key}
          position={[island.center[0], LABEL_Y, island.center[1]]}
          center
          distanceFactor={22}
          occlude={false}
          style={{ pointerEvents: 'none' }}
        >
          <span
            className="whitespace-nowrap rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-base font-semibold text-white shadow-[0_14px_40px_-12px_rgba(13,59,94,0.8)] backdrop-blur-md"
            style={{ fontFamily: 'var(--font-head)' }}
          >
            {island.name}
          </span>
        </Html>
      ))}
    </>
  )
}

// ─── Third-person chase camera (rides behind/above the boat) ──────────────────
function CameraRig() {
  const first = useRef(true)
  const lookAt = useRef(new THREE.Vector3())
  const { active } = useJourney()

  // Snap (don't glide) to the boat whenever the journey re-enters the page.
  useEffect(() => { first.current = true }, [active])

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.05)
    const fwdX = Math.sin(boatState.yaw)
    const fwdZ = Math.cos(boatState.yaw)

    const eyeX = boatState.x - fwdX * BOAT.camBack
    const eyeZ = boatState.z - fwdZ * BOAT.camBack
    const eyeY = boatState.y + BOAT.camUp

    const a = first.current ? 1 : Math.min(1, dt * 3)
    camera.position.x += (eyeX - camera.position.x) * a
    camera.position.y += (eyeY - camera.position.y) * a
    camera.position.z += (eyeZ - camera.position.z) * a

    lookAt.current.set(
      boatState.x + fwdX * BOAT.camLookAhead,
      boatState.y + BOAT.camLookHeight,
      boatState.z + fwdZ * BOAT.camLookAhead
    )
    camera.lookAt(lookAt.current)
    first.current = false
  })

  return null
}

// ─── All scene objects ────────────────────────────────────────────────────────
function SceneContents() {
  return (
    <>
      <Sky
        distance={450000}
        sunPosition={[2, 0.08, -1]}
        turbidity={11}
        rayleigh={0.55}
        mieCoefficient={0.004}
        mieDirectionalG={0.82}
      />

      <ambientLight intensity={0.65} />
      <directionalLight position={[10, 18, 6]} intensity={1.5} color="#FFF2CC" />
      <directionalLight position={[-8, 5, -10]} intensity={0.28} color="#B8D4E3" />

      <fog attach="fog" args={['#a8d8ea', 70, 220]} />

      <CameraRig />

      <Suspense fallback={null}>
        <Ocean />
        <IslandModel />
        <Boat />
        <Environment preset="dawn" />
      </Suspense>

      <IslandLabels />
    </>
  )
}

// ─── Root component ───────────────────────────────────────────────────────────
export default function Scene3D() {
  return (
    // Pure background: free-roam boat + page content render on top.
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, background: '#a8d8ea' }}>
      <Canvas
        camera={{
          position: [
            START.x - Math.sin(START.yaw) * BOAT.camBack,
            FLOAT_Y + BOAT.camUp,
            START.z - Math.cos(START.yaw) * BOAT.camBack
          ],
          fov: 60
        }}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <SceneContents />
      </Canvas>
    </div>
  )
}

if (typeof window !== 'undefined') {
  useGLTF.preload(ISLAND_GLB)
  useGLTF.preload(BOAT_GLB)
}
