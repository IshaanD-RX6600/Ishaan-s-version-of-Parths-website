'use client'

import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { SunModel } from './BeachModels'
import SurfboardBurst from './SurfboardBurst'
import ThreeErrorBoundary from './ThreeErrorBoundary'

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mx-auto max-w-5xl rounded-[36px] border border-white/70 bg-white/75 p-8 text-center shadow-[0_24px_70px_-24px_rgba(26,58,92,0.28)] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF6B6B]">Horizon call</p>
        <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#1A3A5C] sm:text-4xl" style={{ fontFamily: 'var(--font-head)' }}>
          Ready for a beachy launch, a bright brand, or a playful product story?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#1A3A5C]/80">
          Drop me a line and we’ll make something sunny, smart, and a little bit wiggly. {/* Replace with your real contact pitch. */}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-6">
          <div className="h-[220px] w-full max-w-[260px] rounded-[24px] border border-[#FFD166]/40 bg-[radial-gradient(circle_at_top,_rgba(255,209,102,0.24),_rgba(255,255,255,0.08))] p-3">
            <ThreeErrorBoundary>
              <Canvas camera={{ position: [0, 0.4, 3.7], fov: 28 }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[2, 3, 2]} intensity={1.2} />
                <SunModel />
              </Canvas>
            </ThreeErrorBoundary>
          </div>

          <SurfboardBurst>
            <a href="mailto:hello@parthpandit.com" className="inline-flex rounded-full bg-[#2EC4B6] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[#2EC4B6]/20 transition hover:-translate-y-1">
              Say hello
            </a>
          </SurfboardBurst>
        </div>
      </motion.div>
    </section>
  )
}
