'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import SurfboardBurst from './SurfboardBurst'

export default function Hero() {
  return (
    <section id="hero" className="px-8 py-24 pt-28">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="space-y-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2EC4B6]">Beachy web launch</p>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] text-[#1A3A5C] sm:text-6xl" style={{ fontFamily: 'var(--font-head)' }}>
            Riding the digital wave
          </h1>
          <p className="max-w-xl text-lg leading-8 text-[#1A3A5C]/80">A playful portfolio with calm transitions, sunny cards, and straightforward pages for every part of your story.</p>
          <div className="flex flex-wrap gap-4">
            <SurfboardBurst>
              <Link href="/contact" className="inline-flex rounded-full bg-[#FF6B6B] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF6B6B]/20 transition hover:-translate-y-1">Start a chat</Link>
            </SurfboardBurst>
            <SurfboardBurst>
              <Link href="/projects" className="inline-flex rounded-full border border-[#2EC4B6]/40 bg-white/80 px-6 py-3 text-sm font-semibold text-[#1A3A5C] transition hover:-translate-y-1">See projects</Link>
            </SurfboardBurst>
          </div>
        </motion.div>

        <motion.article initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_-24px_rgba(26,58,92,0.24)]">
          <div className="rounded-[28px] border border-dashed border-[#2EC4B6]/35 bg-[linear-gradient(180deg,#FFF3D6_0%,#FFFFFF_100%)] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF6B6B]">This page</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#1A3A5C]" style={{ fontFamily: 'var(--font-head)' }}>Home hero only</h2>
            <p className="mt-4 text-base leading-8 text-[#1A3A5C]/80">The main home view now stays lightweight and focused, with room for your future case studies and profile notes.</p>
            {/* 3D MODEL GOES HERE */}
          </div>
        </motion.article>
      </div>
    </section>
  )
}
