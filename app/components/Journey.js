'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'

// ─── Scene + content config ───────────────────────────────────────────────────
// Positions are [x, z] in runtime world space (islands.glb rendered at 1.8×).
// `center` anchors the floating label; `berth` is the water dock point the boat
// must reach to sail across to that island's page. `route` is where reaching the
// berth takes the visitor (via the water transition).

export const FLOAT_Y = -2.8 // boat hull resting height on the water
export const LABEL_Y = 12 // height of the floating island signs

// Where the boat spawns every time the journey (re)starts: open water near the
// bottom of the map (z = 46 sits past the islands' ~±39 extent, so it's always
// clear water), pointed up into the archipelago (yaw = π faces −z). x = 4 keeps
// the straight-ahead lane clear of the northern shark that sits near x = 0.
export const START = { x: 4, z: 46, yaw: Math.PI }

// Live boat transform, shared boat → camera → minimap without React re-renders.
// Scene3D's Boat writes it each frame; the chase camera and the minimap read it.
export const boatState = { x: START.x, y: FLOAT_Y, z: START.z, yaw: START.yaw }

// Half-extent (world units) the minimap image spans; must match the range the
// minimap.png was baked at (public/minimap.png → ±48).
export const MINIMAP_RANGE = 48

export const BOAT = {
  glb: 'sailboat.glb',
  scale: 0.0035,
  baseYaw: 0, // set to Math.PI if the hull visually faces backwards
  // Free-roam handling
  moveSpeed: 9, // world units / second at full throttle
  turnSpeed: 1.7, // radians / second
  hullHalf: 2.6, // half-length sampled for collision (bow / stern)
  clearance: 1.3, // how close to land before the boat is eased off (small, so
  // it only nudges right at the shore — a big radius walled the boat out of open
  // water and stalled it in narrow channels)
  pushStrength: 6, // how firmly the boat is shoved away from islands
  // Near-bird's-eye chase camera (high up, slight angle behind the boat)
  camBack: 8,
  camUp: 27,
  camLookAhead: 2,
  camLookHeight: 0
}

export const DOCK_RADIUS = 7.5 // how close the boat must get to a berth to land

export const ISLANDS = [
  {
    key: 'home', name: 'Home', center: [-3.06, -8.72], berth: [-1.86, -11.76],
    route: '/'
  },
  {
    key: 'about', name: 'About', center: [-10.03, 18.48], berth: [-16.71, 11.76],
    route: '/about'
  },
  {
    key: 'projects', name: 'Projects', center: [28.98, 18.65], berth: [34.03, 14.23],
    route: '/projects'
  },
  {
    key: 'skills', name: 'Skills', center: [28.49, -18.59], berth: [24.13, -24.13],
    route: '/skills'
  },
  {
    key: 'contact', name: 'Contact', center: [3.4, -16.53], berth: [-0.62, -14.23],
    route: '/contact'
  }
]

const ISLAND_BY_KEY = Object.fromEntries(ISLANDS.map((i) => [i.key, i]))

// Held movement keys, shared provider → Scene3D without React re-renders.
export const input = { keys: {} }

const MOVE_CODES = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

// ─── Context ──────────────────────────────────────────────────────────────────
const JourneyContext = createContext(null)

export function useJourney() {
  const ctx = useContext(JourneyContext)
  if (!ctx) throw new Error('useJourney must be used within <JourneyProvider>')
  return ctx
}

export function JourneyProvider({ children }) {
  const pathname = usePathname()
  const active = pathname === '/' // free-roam only lives on the landing route

  // The "press any key to set sail" gate. Deliberately NOT persisted, so it
  // greets the visitor every single time they are on the landing page.
  const [started, setStarted] = useState(false)
  const [near, setNear] = useState(null) // island key within docking range
  const [navTarget, setNavTarget] = useState(null) // route the water voyage is heading to

  const startedRef = useRef(started)
  const nearRef = useRef(near)
  const activeRef = useRef(active)
  const navTargetRef = useRef(navTarget)
  startedRef.current = started
  nearRef.current = near
  activeRef.current = active
  navTargetRef.current = navTarget

  // Scene3D reports the nearest dockable island (only when it changes).
  const reportNear = useCallback((key) => setNear(key), [])

  const startSail = useCallback(() => setStarted(true), [])
  const beginVoyage = useCallback((route) => {
    input.keys = {} // drop held keys so the boat stops as the water rises
    setNavTarget(route)
  }, [])
  const endVoyage = useCallback(() => setNavTarget(null), [])

  // Reaching an island's berth sets sail to its page (once, while playing).
  useEffect(() => {
    if (!active || !started || navTarget || !near) return
    const island = ISLAND_BY_KEY[near]
    if (island?.route && island.route !== pathname) beginVoyage(island.route)
  }, [near, active, started, navTarget, pathname, beginVoyage])

  // Global keyboard: "any key" to set sail, then movement (held).
  useEffect(() => {
    const onDown = (e) => {
      if (!activeRef.current) return
      if (!startedRef.current) {
        // Any key launches the journey; don't also act on it this frame.
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
          setStarted(true)
          e.preventDefault()
        }
        return
      }
      if (navTargetRef.current) return // frozen during the water transition
      if (MOVE_CODES.includes(e.code)) {
        input.keys[e.code] = true
        e.preventDefault()
      }
    }
    const onUp = (e) => {
      if (MOVE_CODES.includes(e.code)) input.keys[e.code] = false
    }
    const clear = () => { input.keys = {} }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      window.removeEventListener('blur', clear)
    }
  }, [])

  // Leaving the landing route resets the journey so it greets the visitor anew
  // (intro re-arms, held keys drop, dock state clears) on their return.
  useEffect(() => {
    if (!active) {
      input.keys = {}
      setStarted(false)
      setNear(null)
    }
  }, [active])

  const value = useMemo(
    () => ({
      active,
      started,
      navTarget,
      paused: !started || navTarget != null,
      reportNear,
      startSail,
      endVoyage
    }),
    [active, started, navTarget, reportNear, startSail, endVoyage]
  )

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}

// ─── Reusable wavy waterline (leading edge of the transition + intro) ──────────
function WaveEdge({ className, fill = '#ffffff', flip = false }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={className}
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
      aria-hidden
    >
      <path
        fill={fill}
        d="M0,64 C180,112 360,16 540,40 C720,64 900,120 1080,104 C1260,88 1380,40 1440,48 L1440,120 L0,120 Z"
      />
    </svg>
  )
}

// ─── "Press any key to set sail" intro (shows on every landing-page visit) ─────
function Intro() {
  const { active, started, navTarget, startSail } = useJourney()
  const show = active && !started && !navTarget

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          role="button"
          tabIndex={0}
          onClick={startSail}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center text-center"
          style={{ background: 'linear-gradient(180deg, rgba(13,59,94,0.35) 0%, rgba(13,59,94,0.6) 100%)' }}
        >
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xs font-semibold uppercase tracking-[0.5em] text-[#FFD166] drop-shadow"
          >
            Parth Pandit
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="mt-4 max-w-2xl px-6 text-4xl font-semibold leading-tight text-white drop-shadow-lg sm:text-6xl"
            style={{ fontFamily: 'var(--font-head)' }}
          >
            Press any key to set sail
          </motion.h1>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-6 rounded-full border border-white/40 bg-white/10 px-5 py-2 text-xs font-medium uppercase tracking-[0.3em] text-white/90 backdrop-blur-sm"
          >
            Any key · or tap · to begin
          </motion.span>

          {/* gently lapping waterline along the bottom */}
          <motion.div
            initial={{ y: 12 }}
            animate={{ y: [12, 4, 12] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute bottom-0 left-0 w-full"
          >
            <WaveEdge className="h-24 w-full" fill="rgba(63,183,201,0.55)" />
            <WaveEdge className="-mt-20 h-24 w-full" fill="rgba(13,59,94,0.7)" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Water voyage: sweeps over the screen, navigates, then washes away ─────────
function Voyage() {
  const { navTarget, endVoyage } = useJourney()
  const router = useRouter()
  const [phase, setPhase] = useState('cover') // 'cover' rises in → 'reveal' washes out
  const timer = useRef(null)

  useEffect(() => {
    if (navTarget) setPhase('cover')
  }, [navTarget])

  useEffect(() => () => clearTimeout(timer.current), [])

  const onComplete = () => {
    if (phase === 'cover') {
      router.push(navTarget)
      // Brief hold on the full-screen water, then let the new page show through.
      timer.current = setTimeout(() => setPhase('reveal'), 160)
    } else {
      endVoyage()
    }
  }

  return (
    <AnimatePresence>
      {navTarget && (
        <motion.div
          key="voyage"
          initial={{ y: '100%' }}
          animate={{ y: phase === 'reveal' ? '-100%' : '0%' }}
          transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
          onAnimationComplete={onComplete}
          className="pointer-events-auto fixed inset-0 z-[60]"
        >
          <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#3FB7C9] via-[#1C6E8C] to-[#0D3B5E]">
            {/* foamy leading edge of the rising water */}
            <WaveEdge className="absolute left-0 top-0 h-28 w-full -translate-y-[88%]" fill="#3FB7C9" flip />
            <WaveEdge className="absolute left-0 top-0 h-20 w-full -translate-y-[60%]" fill="rgba(255,255,255,0.35)" flip />

            <div className="flex h-full w-full items-center justify-center">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: phase === 'cover' ? 1 : 0, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="text-sm font-semibold uppercase tracking-[0.45em] text-white/90 drop-shadow"
                style={{ fontFamily: 'var(--font-head)' }}
              >
                Charting course…
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Sailing controls hint (after the journey begins) ──────────────────────────
function ControlsHint() {
  const { active, started, navTarget } = useJourney()

  return (
    <AnimatePresence>
      {active && started && !navTarget && (
        <motion.div
          key="controls"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-30 -translate-x-1/2 text-center"
        >
          <span className="rounded-full bg-black/25 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-white/85 backdrop-blur-sm">
            W A S D / arrows to sail · reach an island to explore it
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Minimap (Fortnite-style): top-down map with a live boat marker ───────────
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const MAP_PX = 176 // on-screen size of the map face
const clamp01 = (v) => Math.min(1, Math.max(0, v))

function Minimap() {
  const { active, started, navTarget } = useJourney()
  const show = active && started && !navTarget
  const marker = useRef(null)

  // Drive the boat marker straight off the shared boatState every frame — no
  // React re-renders. World (x, z) → map face: +x right, +z down (matches how
  // minimap.png was baked). The arrow points along the heading.
  useEffect(() => {
    if (!show) return
    let raf
    const tick = () => {
      const m = marker.current
      if (m) {
        const u = clamp01((boatState.x + MINIMAP_RANGE) / (2 * MINIMAP_RANGE))
        const v = clamp01((boatState.z + MINIMAP_RANGE) / (2 * MINIMAP_RANGE))
        const deg = 180 - (boatState.yaw * 180) / Math.PI
        m.style.transform = `translate(${u * MAP_PX}px, ${v * MAP_PX}px) translate(-50%, -50%) rotate(${deg}deg)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="minimap"
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="pointer-events-none fixed left-4 top-20 z-30"
        >
          <div
            className="relative overflow-hidden rounded-2xl border-2 border-white/55 shadow-[0_18px_45px_-12px_rgba(13,59,94,0.85)]"
            style={{ width: MAP_PX, height: MAP_PX }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE}/minimap.png`}
              alt="Map of the archipelago"
              draggable={false}
              className="absolute inset-0 h-full w-full select-none object-cover"
            />

            {/* island destination dots */}
            {ISLANDS.map((island) => (
              <span
                key={island.key}
                className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-1 ring-[#0D3B5E]/70"
                style={{
                  left: clamp01((island.center[0] + MINIMAP_RANGE) / (2 * MINIMAP_RANGE)) * MAP_PX,
                  top: clamp01((island.center[1] + MINIMAP_RANGE) / (2 * MINIMAP_RANGE)) * MAP_PX
                }}
              />
            ))}

            {/* boat marker — rotates with heading */}
            <svg
              ref={marker}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              className="absolute left-0 top-0 will-change-transform"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.65))' }}
              aria-hidden
            >
              <path
                d="M10 2 L15.5 17 L10 13.5 L4.5 17 Z"
                fill="#FFD166"
                stroke="#0D3B5E"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>

            {/* inner frame + north marker */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
            <span className="absolute left-1/2 top-1 -translate-x-1/2 rounded-full bg-[#0D3B5E]/75 px-1.5 text-[9px] font-bold leading-snug text-white/90">
              N
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── DOM overlay: intro gate, sailing hint, water voyage transition ───────────
export function JourneyOverlay() {
  return (
    <>
      <Minimap />
      <ControlsHint />
      <Intro />
      <Voyage />
    </>
  )
}
