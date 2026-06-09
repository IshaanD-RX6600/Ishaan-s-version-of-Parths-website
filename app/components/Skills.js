'use client'

import { motion } from 'framer-motion'
import SurfboardBurst from './SurfboardBurst'

const skills = [
  'UI concepts',
  'Visual systems',
  'Motion design',
  'Frontend craft',
  'Beachy brand vibes',
  'Launch-ready polish'
]

export default function Skills() {
  return (
    <section className="px-8 py-24">
      <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-2">
        {skills.map((skill, index) => (
          <motion.article key={skill} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04, duration: 0.35 }} className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_-24px_rgba(26,58,92,0.24)] hover:-translate-y-1 transition-transform">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2EC4B6]">0{index + 1}</p>
                <h3 className="mt-2 text-2xl font-semibold text-[#1A3A5C]" style={{ fontFamily: 'var(--font-head)' }}>{skill}</h3>
              </div>
              <SurfboardBurst>
                <span className="rounded-full bg-[#FFF3D6] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1A3A5C]">tag</span>
              </SurfboardBurst>
            </div>
            <p className="mt-4 text-base leading-8 text-[#1A3A5C]/80">A playful skill card with a small surfboard pop-up for that beachy interaction cue.</p>
          </motion.article>
        ))}
      </div>
      {/* 3D MODEL GOES HERE */}
    </section>
  )
}
