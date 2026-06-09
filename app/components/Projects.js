'use client'

import { motion } from 'framer-motion'
import SurfboardBurst from './SurfboardBurst'

const projects = [
  {
    number: '01',
    title: 'Sunbeam launch',
    description: 'A cheerful launch page with a bright story arc and polished interaction.'
  },
  {
    number: '02',
    title: 'Wavey brand kit',
    description: 'A playful identity system that felt as breezy as a weekend market.'
  },
  {
    number: '03',
    title: 'Shell studio',
    description: 'A custom product experience that moved with calm confidence.'
  }
]

export default function Projects() {
  return (
    <section className="px-8 py-24">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <motion.article key={project.number} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04, duration: 0.35 }} className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_-24px_rgba(26,58,92,0.24)] hover:-translate-y-1 transition-transform">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF6B6B]">{project.number}</p>
                <h3 className="mt-2 text-2xl font-semibold text-[#1A3A5C]" style={{ fontFamily: 'var(--font-head)' }}>{project.title}</h3>
              </div>
              <SurfboardBurst>
                <span className="rounded-full bg-[#FFF3D6] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1A3A5C]">case</span>
              </SurfboardBurst>
            </div>
            <p className="mt-4 text-base leading-8 text-[#1A3A5C]/80">{project.description}</p>
          </motion.article>
        ))}
      </div>
      {/* 3D MODEL GOES HERE */}
    </section>
  )
}
