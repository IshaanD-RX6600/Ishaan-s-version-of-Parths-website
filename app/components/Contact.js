'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import SurfboardBurst from './SurfboardBurst'

export default function Contact() {
  return (
    <section className="px-8 py-24">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="mx-auto max-w-5xl rounded-[32px] border border-white/70 bg-white/80 p-8 text-center shadow-[0_24px_70px_-24px_rgba(26,58,92,0.24)] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF6B6B]">Horizon call</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#1A3A5C] sm:text-4xl" style={{ fontFamily: 'var(--font-head)' }}>Ready for a bright launch or a calm product story?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#1A3A5C]/80">This page keeps the path simple: one CTA, one card, one clear next step.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <SurfboardBurst>
            <a href="mailto:hello@parthpandit.com" className="inline-flex rounded-full bg-[#2EC4B6] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[#2EC4B6]/20 transition hover:-translate-y-1">Say hello</a>
          </SurfboardBurst>
          <Link href="/projects" className="inline-flex rounded-full border border-[#2EC4B6]/40 bg-white/90 px-6 py-3 text-sm font-semibold text-[#1A3A5C] transition hover:-translate-y-1">See case studies</Link>
        </div>
        {/* 3D MODEL GOES HERE */}
      </motion.div>
    </section>
  )
}
