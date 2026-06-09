'use client'

import { motion } from 'framer-motion'

const skills = ['Next.js', 'Tailwind CSS', 'Framer Motion', 'GitHub']

export default function SkillsPage() {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-10">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mx-auto max-w-4xl rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_-30px_rgba(26,58,92,0.35)] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#2EC4B6]">Skills</p>
        <h1 className="mt-3 text-4xl font-semibold text-[#1A3A5C]" style={{ fontFamily: 'var(--font-head)' }}>Core skills</h1>
        <div className="mt-6 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span key={skill} className="rounded-full bg-[#2EC4B6] px-4 py-2 text-sm font-semibold text-white shadow-sm">{skill}</span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
