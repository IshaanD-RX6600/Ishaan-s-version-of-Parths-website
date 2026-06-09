'use client'

import { motion } from 'framer-motion'
import SurfboardBurst from './SurfboardBurst'

export default function About() {
  return (
    <section className="px-8 py-24">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="mx-auto max-w-5xl rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_24px_70px_-24px_rgba(26,58,92,0.24)] sm:p-10">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2EC4B6]">About the tide</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#1A3A5C] sm:text-4xl" style={{ fontFamily: 'var(--font-head)' }}>A bright, clear voice for playful brands and product launches.</h2>
          </div>
          <SurfboardBurst>
            <div className="rounded-full border border-[#FF6B6B]/30 bg-[#FFF3D6] px-3 py-2 text-sm font-semibold text-[#1A3A5C]">sun</div>
          </SurfboardBurst>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-[24px] border border-dashed border-[#2EC4B6]/40 bg-[#FFF3D6]/70 p-6 text-base leading-8 text-[#1A3A5C]/80">This page keeps the tone light, direct, and easy to scan, with a surfboard hover accent for a playful finish.</article>
          <article className="rounded-[24px] border border-[#FFD166]/40 bg-white/90 p-6 text-base leading-8 text-[#1A3A5C]/80">The layout stays centered, balanced, and responsive so the content feels steady across desktop and mobile.</article>
        </div>
        {/* 3D MODEL GOES HERE */}
      </motion.div>
    </section>
  )
}
