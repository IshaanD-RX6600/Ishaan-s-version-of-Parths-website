'use client'

import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-10">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mx-auto max-w-4xl rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_-30px_rgba(26,58,92,0.35)] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#2EC4B6]">About</p>
        <h1 className="mt-3 text-4xl font-semibold text-[#1A3A5C]" style={{ fontFamily: 'var(--font-head)' }}>About this simple starter</h1>
        <p className="mt-4 text-base leading-8 text-[#1A3A5C]/80">This page is intentionally lightweight so the app can load without the runtime issues that were causing the 500 errors.</p>
      </motion.div>
    </section>
  )
}
