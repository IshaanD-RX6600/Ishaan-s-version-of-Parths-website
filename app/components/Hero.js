'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import SurfboardBurst from './SurfboardBurst'
import { SurfboardModel } from './BeachModels'
import ThreeErrorBoundary from './ThreeErrorBoundary'

export default function Hero() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -80])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -18])

  return (
    <section id="hero" ref={sectionRef} className="relative px-6 pb-24 pt-28 sm:px-8 lg:pb-32 lg:pt-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
          <span className="inline-flex rounded-full bg-[#FFD166] px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-[#1A3A5C]">
            🌊 beachy web fun
          </span>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] text-[#1A3A5C] sm:text-6xl lg:text-7xl" style={{ fontFamily: 'var(--font-head)' }}>
              Riding the digital wave 🏄
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#1A3A5C]/80">
              I make playful product experiences that feel like a sunny beach day and a smart launch strategy rolled into one. {/* Replace with your real intro. */}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <SurfboardBurst>
              <a href="#contact" className="inline-flex rounded-full bg-[#FF6B6B] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF6B6B]/20 transition hover:-translate-y-1">
                Splash me a hello
              </a>
            </SurfboardBurst>
            <SurfboardBurst>
              <a href="#projects" className="inline-flex rounded-full border border-[#2EC4B6]/40 bg-white/80 px-6 py-3 text-sm font-semibold text-[#1A3A5C] transition hover:-translate-y-1">
                Peek at projects
              </a>
            </SurfboardBurst>
          </div>

          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 1.6, repeat: Infinity }} className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#1A3A5C] shadow-sm">
            <span className="text-lg">⬇️</span>
            Scroll for the tide
          </motion.div>
        </motion.div>

        <motion.div style={{ y, rotate }} className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/70 p-4 shadow-[0_30px_80px_-25px_rgba(26,58,92,0.28)] sm:p-6">
          <div className="relative h-[470px] w-full rounded-[28px] bg-[radial-gradient(circle_at_top,_rgba(255,209,102,0.45),_transparent_45%)] lg:h-[560px]">
            <ThreeErrorBoundary>
              <Canvas camera={{ position: [0, 1.2, 5.8], fov: 28 }}>
                <ambientLight intensity={0.9} />
                <directionalLight position={[3, 4, 3]} intensity={1.4} />
                <pointLight position={[0, 2, 2]} intensity={0.8} color="#FFD166" />
                <SurfboardModel />
              </Canvas>
            </ThreeErrorBoundary>
          </div>
          <div className="absolute bottom-4 left-4 right-4 rounded-[24px] border border-white/80 bg-white/85 p-4 text-sm leading-7 text-[#1A3A5C] shadow-sm">
            Tiny detail: this board is always ready for the next bright idea. {/* Replace with your favorite tagline. */}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
