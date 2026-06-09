'use client'

import { motion } from 'framer-motion'
import WaveDivider from './WaveDivider'

export default function PageShell({ eyebrow, title, description, children, accent = '#FF6B6B' }) {
  return (
    <section className="px-8 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2EC4B6]">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#1A3A5C] sm:text-5xl" style={{ fontFamily: 'var(--font-head)' }}>{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#1A3A5C]/80">{description}</p>
        </motion.div>
        {children}
      </div>
      <WaveDivider accent={accent} />
    </section>
  )
}
