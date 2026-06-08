'use client'

import { motion } from 'framer-motion'

const projects = [
  {
    title: 'Lighthouse platform',
    description: 'A polished feature launch with motion-led storytelling and thoughtful product clarity.',
    accent: 'UX systems'
  },
  {
    title: 'Shoreline identity',
    description: 'Brand narratives built with warm gradients, responsive cards, and elegant interaction.',
    accent: 'Brand design'
  },
  {
    title: 'Wave-driven interfaces',
    description: 'Modern landing pages that balance technical depth with cinematic animation.',
    accent: 'Front-end craft'
  }
]

export default function Work() {
  return (
    <section id="work" className="px-6 py-24 sm:px-8 lg:px-10">
      <motion.div className="mx-auto max-w-6xl" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
        <span className="text-sm uppercase tracking-[0.34em] text-ocean/85">The Reef</span>
        <div className="mt-6 space-y-8">
          <h2 className="text-3xl font-semibold tracking-tight text-driftwood sm:text-4xl">
            Selected work that moves with depth and clarity.
          </h2>
          <p className="max-w-2xl text-base leading-8 text-driftwood/75">
            A curated set of projects that shows how design systems, motion, and storytelling come together for a refined coastal portfolio.
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-3">
          {projects.map((project) => (
            <motion.article key={project.title} whileHover={{ y: -6 }} className="rounded-[28px] border border-white/70 bg-sky/8 p-8 shadow-[0_32px_80px_-40px_rgba(13,59,94,0.38)] transition-transform">
              <span className="text-xs uppercase tracking-[0.36em] text-ocean/70">{project.accent}</span>
              <h3 className="mt-4 text-2xl font-semibold text-driftwood">{project.title}</h3>
              <p className="mt-4 text-base leading-7 text-driftwood/70">{project.description}</p>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ocean">
                <span>View case study</span>
                <span aria-hidden="true">→</span>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
