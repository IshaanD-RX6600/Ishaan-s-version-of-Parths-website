'use client'

import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_-30px_rgba(26,58,92,0.35)] lg:flex-row lg:items-center lg:justify-between lg:p-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#2EC4B6]">Welcome</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#1A3A5C] sm:text-5xl" style={{ fontFamily: 'var(--font-head)' }}>
            A simple, beachy portfolio that renders cleanly.
          </h1>
          <p className="mt-4 text-base leading-8 text-[#1A3A5C]/80">
            This fresh app uses only Tailwind CSS and Framer Motion to keep the experience lightweight and easy to debug.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="grid gap-4 rounded-[28px] bg-[#FFF3D6] p-5 shadow-inner sm:grid-cols-2 lg:min-w-[340px] lg:grid-cols-1">
          <div className="rounded-[24px] bg-white p-4 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-[#FF6B6B]">Status</p>
            <p className="mt-2 text-xl font-semibold text-[#1A3A5C]">Stable</p>
          </div>
          <div className="rounded-[24px] bg-white p-4 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-[#2EC4B6]">Theme</p>
            <p className="mt-2 text-xl font-semibold text-[#1A3A5C]">Beach</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
