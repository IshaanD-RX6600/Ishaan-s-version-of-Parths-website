'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { BeachBallModel } from './BeachModels'
import SurfboardBurst from './SurfboardBurst'
import ThreeErrorBoundary from './ThreeErrorBoundary'

const skills = [
  'UI concepts',
  'Visual systems',
  'Motion design',
  '3D storytelling',
  'Frontend craft',
  'Beachy brand vibes'
]

export default function Skills() {
  const [built, setBuilt] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setBuilt(true)
      },
      { threshold: 0.3 }
    )

    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" ref={cardRef} className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF6B6B]">Skill splash</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#1A3A5C] sm:text-4xl" style={{ fontFamily: 'var(--font-head)' }}>
            A cheerful toolbox for bright ideas and bouncy launches.
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_-24px_rgba(26,58,92,0.28)]">
            <div className="h-[300px] rounded-[24px] border border-[#FFD166]/40 bg-[radial-gradient(circle_at_top,_rgba(255,209,102,0.28),_rgba(255,255,255,0.05))] p-4">
              <ThreeErrorBoundary>
                <Canvas camera={{ position: [0, 0.8, 4], fov: 28 }}>
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[2, 3, 2]} intensity={1.2} />
                  <BeachBallModel />
                </Canvas>
              </ThreeErrorBoundary>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((skill, index) => (
              <motion.div key={skill} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06, duration: 0.5 }} className="rounded-[24px] border border-white/70 bg-white/75 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2EC4B6]">0{index + 1}</p>
                    <h3 className="mt-2 text-xl font-semibold text-[#1A3A5C]">{skill}</h3>
                  </div>
                  <SurfboardBurst>
                    <span className="rounded-full bg-[#FFF3D6] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1A3A5C]">wave</span>
                  </SurfboardBurst>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#1A3A5C]/75">A playful slice of the toolkit that turns bright ideas into airy, memorable interactions. {/* Replace with your actual skill detail. */}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
