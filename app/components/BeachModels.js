'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'

function useMouseTilt() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 0.12
      const y = (event.clientY / window.innerHeight - 0.5) * 0.12
      setTilt({ x: -y, y: x })
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return tilt
}

export function SurfboardModel() {
  const groupRef = useRef(null)
  const tilt = useMouseTilt()

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.7
    groupRef.current.rotation.x = 0.3 + tilt.x * 0.25
    groupRef.current.rotation.z = tilt.y * 0.2
    groupRef.current.position.set(0, Math.sin(state.clock.elapsedTime * 2.3) * 0.12 + 0.05, 0)
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[0, 0.15, 0]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[2.1, 0.14, 0.7]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.18, 0.3]} rotation={[0.12, 0, 0]}>
          <boxGeometry args={[1.8, 0.08, 0.4]} />
          <meshStandardMaterial color="#FF6B6B" roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.18, -0.3]} rotation={[-0.12, 0, 0]}>
          <boxGeometry args={[1.8, 0.08, 0.4]} />
          <meshStandardMaterial color="#2EC4B6" roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2.2, 8]} />
          <meshStandardMaterial color="#1A3A5C" />
        </mesh>
      </Float>
    </group>
  )
}

export function BeachBallModel() {
  const groupRef = useRef(null)
  const tilt = useMouseTilt()

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.8
    groupRef.current.rotation.x = tilt.x * 0.14
    groupRef.current.rotation.z = tilt.y * 0.14
    groupRef.current.position.set(0, Math.sin(state.clock.elapsedTime * 2.2) * 0.09, 0)
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh>
          <sphereGeometry args={[0.4, 24, 24]} />
          <meshStandardMaterial color="#FFD166" roughness={0.4} />
        </mesh>
        <mesh rotation={[0, 0, 0.6]}>
          <torusGeometry args={[0.45, 0.04, 10, 24]} />
          <meshStandardMaterial color="#FF6B6B" />
        </mesh>
      </Float>
    </group>
  )
}

export function SandcastleModel({ built }) {
  const groupRef = useRef(null)
  const tilt = useMouseTilt()

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.35
    groupRef.current.rotation.x = tilt.x * 0.16
    groupRef.current.rotation.z = tilt.y * 0.16
    groupRef.current.position.set(0, 0, 0)
    groupRef.current.scale.y = 0.9 + Math.sin(state.clock.elapsedTime * 1.7) * 0.03
  })

  const height = built ? 1 : 0.2

  return (
    <group ref={groupRef}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[1.2, height, 1]} />
        <meshStandardMaterial color="#FFD166" roughness={0.8} />
      </mesh>
      <mesh position={[0, height + 0.35, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
      </mesh>
      <mesh position={[0.45, height + 0.15, 0]}>
        <boxGeometry args={[0.18, 0.35, 0.18]} />
        <meshStandardMaterial color="#2EC4B6" roughness={0.9} />
      </mesh>
      <mesh position={[-0.45, height + 0.15, 0]}>
        <boxGeometry args={[0.18, 0.35, 0.18]} />
        <meshStandardMaterial color="#2EC4B6" roughness={0.9} />
      </mesh>
    </group>
  )
}

export function SunModel() {
  const groupRef = useRef(null)
  const tilt = useMouseTilt()

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.z += delta * 0.35
    groupRef.current.rotation.x = tilt.x * 0.12
    groupRef.current.rotation.y = tilt.y * 0.12
    groupRef.current.position.set(0, 0, 0)
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#FFD166" emissive="#ffdb6b" roughness={0.35} />
      </mesh>
      {[...Array(8)].map((_, index) => (
        <mesh key={index} rotation={[0, 0, (index / 8) * Math.PI * 2]} position={[0, 1.1, 0]}>
          <boxGeometry args={[0.16, 0.3, 0.06]} />
          <meshStandardMaterial color="#FF6B6B" />
        </mesh>
      ))}
    </group>
  )
}
