'use client'

import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <section id="contact" className="border-t border-white/20 bg-ocean/5 px-6 py-24 sm:px-8 lg:px-10">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="mx-auto max-w-6xl text-center">
        <span className="text-sm uppercase tracking-[0.34em] text-ocean/85">Horizon</span>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-driftwood sm:text-4xl">
          Ready to build your next memorable digital experience?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-driftwood/75">
          I bring motion, craftsmanship, and calm confidence to every product and portfolio narrative. Let’s start with a quick conversation.
        </p>
        <a href="mailto:hello@parthpandit.com" className="mt-10 inline-flex rounded-full bg-coral px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-coral/20 transition hover:-translate-y-0.5 hover:bg-[#d98667]">
          Say hello
        </a>
      </motion.div>
    </section>
  )
}
