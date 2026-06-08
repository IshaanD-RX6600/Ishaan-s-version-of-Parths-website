'use client'

import { motion } from 'framer-motion'
import { Text, View } from 'react-bits'

export default function About() {
  return (
    <section id="about" className="border-t border-white/20 bg-white/80 px-6 py-24 sm:px-8 lg:px-10">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="mx-auto max-w-6xl">
        <span className="text-sm uppercase tracking-[0.34em] text-ocean/85">Tide Pool</span>
        <div className="mt-6 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-driftwood sm:text-4xl">
              Crafted storytelling with rhythm, scale, and thoughtful detail.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-driftwood/75">
              From calm landing moments to interactive scroll transitions, every section is designed to feel deliberate, warm, and effortlessly polished.
            </p>
          </div>

          <View style={{ borderRadius: 28, borderWidth: 1, borderColor: '#d6cab8', padding: 24, backgroundColor: 'rgba(91,196,191,0.08)' }}>
            <Text style={{ fontSize: 15, fontWeight: 700, color: '#0D3B5E', marginBottom: 12 }}>Nearby highlights</Text>
            <Text style={{ fontSize: 15, lineHeight: 1.8, color: '#3E3A3A' }}>
              Designed in a beach palette with responsive motion, this portfolio blends professional layout systems with a cinematic seaside energy.
            </Text>
          </View>
        </div>
      </motion.div>
    </section>
  )
}
