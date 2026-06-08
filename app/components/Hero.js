'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, Html } from '@react-three/drei'
import { motion, useScroll, useTransform } from 'framer-motion'
import { View, Text } from 'react-bits'

function BeachGlow() {
  const ref = useRef()
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.16
    }
  })

  return (
    <Float floatIntensity={2} rotationIntensity={0.5} speed={1.1}>
      <mesh ref={ref} position={[0, 0.6, 0]}>
        <icosahedronGeometry args={[1.45, 3]} />
        <meshStandardMaterial color="#5BC4BF" emissive="#9EE3DA" roughness={0.28} metalness={0.25} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]}>
        <cylinderGeometry args={[2.9, 2.9, 0.14, 48]} />
        <meshStandardMaterial color="#E8A87C" roughness={0.9} />
      </mesh>
    </Float>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const y = useTransform(scrollYProgress, [0, 1], [0, -120])

  return (
    <section id="hero" ref={ref} className="relative overflow-hidden px-6 pt-28 pb-24 sm:px-8 lg:pb-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }} className="space-y-8">
          <span className="inline-flex rounded-full bg-ocean/10 px-4 py-2 text-xs uppercase tracking-[0.4em] text-ocean/90 sm:text-sm">
            oceanfront design
          </span>
          <div className="space-y-6">
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-[-0.05em] text-driftwood sm:text-6xl lg:text-7xl">
              I build immersive digital experiences with calm, cinematic motion.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-driftwood/75 sm:text-lg">
              A beachfront portfolio where light motion, 3D shorelines, and polished interaction meet modern product storytelling.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a href="#contact" className="inline-flex rounded-full bg-ocean px-6 py-3 text-sm font-semibold text-white transition hover:shadow-[0_16px_30px_-18px_rgba(13,59,94,0.9)]">
              Let’s connect
            </a>
            <a href="#work" className="inline-flex items-center rounded-full border border-ocean/15 px-6 py-3 text-sm font-semibold text-driftwood transition hover:border-ocean hover:text-ocean">
              Explore projects
            </a>
          </div>

          <View style={{ alignItems: 'flex-start', padding: 16, borderRadius: 24, backgroundColor: 'rgba(245, 236, 215, 0.92)', maxWidth: 420 }}>
            <Text style={{ fontSize: 13, fontWeight: 700, color: '#0D3B5E', marginBottom: 8 }}>
              cross-platform story
            </Text>
            <Text style={{ fontSize: 15, lineHeight: 1.6, color: '#3E3A3A' }}>
              React Bits powers the shore-ready system in this experience, bringing consistent UX into a web-first portfolio.
            </Text>
          </View>
        </motion.div>

        <motion.div style={{ scale, y }} className="relative isolate overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-4 shadow-[0_40px_120px_-45px_rgba(13,59,94,0.45)] sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/90 to-transparent" />
          <div className="relative h-[520px] w-full rounded-[28px] bg-sky/10 shadow-[inset_0_0_120px_rgba(255,255,255,0.8)] lg:h-[580px]">
            <Canvas camera={{ position: [0, 1.25, 6], fov: 28 }} className="rounded-[28px]">
              <ambientLight intensity={0.8} />
              <spotLight position={[10, 12, 10]} angle={0.22} penumbra={0.7} intensity={1.5} />
              <BeachGlow />
              <Environment preset="sunset" />
            </Canvas>
          </div>
          <div className="absolute bottom-4 left-4 right-4 rounded-3xl border border-white/70 bg-white/80 p-4 backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.32em] text-ocean/80">Tide pool experience</p>
            <p className="mt-2 text-base leading-7 text-driftwood/85">
              Smooth motion, warm gradients, and a calm interface frame the portfolio’s shore-to-horizon story.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
