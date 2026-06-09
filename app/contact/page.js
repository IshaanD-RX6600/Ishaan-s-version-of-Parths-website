'use client'

import { motion } from 'framer-motion'

export default function ContactPage() {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-10">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mx-auto max-w-4xl rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_-30px_rgba(26,58,92,0.35)] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF6B6B]">Contact</p>
        <h1 className="mt-3 text-4xl font-semibold text-[#1A3A5C]" style={{ fontFamily: 'var(--font-head)' }}>Get in touch</h1>
        <p className="mt-4 text-base leading-8 text-[#1A3A5C]/80">Use this page as the starting point for your contact details and form.</p>
      </motion.div>
    </section>
  )
}
