'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { SandcastleModel } from './BeachModels'
import SurfboardBurst from './SurfboardBurst'
import ThreeErrorBoundary from './ThreeErrorBoundary'

const projects = [
  {
    number: '01',
    title: 'Sunbeam launch',
    description: 'A cheerful launch page with a bright story arc and polished interaction. {/* Replace with your project summary. */}'
  },
  {
    number: '02',
    title: 'Wavey brand kit',
    description: 'A playful identity system that felt as breezy as a weekend market. {/* Replace with your project summary. */}'
  },
  {
    number: '03',
    title: 'Shell studio',
    description: 'A custom product experience that moved with calm confidence. {/* Replace with your project summary. */}'
  }
]

export default function Projects() {
  const [built, setBuilt] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setBuilt(true)
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="projects" ref={ref} className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2EC4B6]">Project reef</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#1A3A5C] sm:text-4xl" style={{ fontFamily: 'var(--font-head)' }}>
            Numbers, waves, and a few tiny castles full of imagination.
          </h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div className="grid gap-4">
            {projects.map((project, index) => (
              <motion.article key={project.number} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08, duration: 0.5 }} className="rounded-[26px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_-24px_rgba(26,58,92,0.28)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#FF6B6B]">{project.number}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-[#1A3A5C]">{project.title}</h3>
                  </div>
                  <SurfboardBurst>
                    <span className="rounded-full border border-[#2EC4B6]/35 bg-[#FFF3D6] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1A3A5C]">view</span>
                  </SurfboardBurst>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#1A3A5C]/75">{project.description}</p>
              </motion.article>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="rounded-[32px] border border-white/70 bg-[#FFF3D6]/70 p-6 shadow-[0_20px_60px_-24px_rgba(26,58,92,0.28)]">
            <div className="h-[340px] rounded-[24px] border border-[#2EC4B6]/30 bg-[radial-gradient(circle_at_top,_rgba(46,196,182,0.18),_rgba(255,255,255,0.04))] p-4">
              <ThreeErrorBoundary>
                <Canvas camera={{ position: [0, 1.5, 4.8], fov: 28 }}>
                  <ambientLight intensity={0.9} />
                  <directionalLight position={[2, 3, 2]} intensity={1.2} />
                  <SandcastleModel built={built} />
                </Canvas>
              </ThreeErrorBoundary>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#1A3A5C]/75">The sandcastle rises as you scroll in — a little bit of build-up, a little bit of sparkle. {/* Replace with a real project note. */}</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
