'use client'

import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#87CEEB] text-[#1A3A5C]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#87CEEB_0%,#FFF3D6_55%,#FFF3D6_100%)]" />

      <style jsx global>{`
        @keyframes drift {
          0% { transform: translateX(0); }
          50% { transform: translateX(12px); }
          100% { transform: translateX(0); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); transform-origin: bottom center; }
          50% { transform: rotate(4deg); transform-origin: bottom center; }
        }
        .cloud-drift { animation: drift 18s ease-in-out infinite; }
        .leaf-sway { animation: sway 4.5s ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-x-0 top-0 h-32 opacity-90">
        <svg viewBox="0 0 800 160" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
          <g className="cloud-drift" fill="rgba(255,255,255,0.75)">
            <ellipse cx="160" cy="46" rx="54" ry="24" />
            <ellipse cx="210" cy="38" rx="38" ry="20" />
            <ellipse cx="260" cy="48" rx="50" ry="24" />
          </g>
          <g className="cloud-drift" style={{ animationDelay: '-8s' }} fill="rgba(255,255,255,0.55)">
            <ellipse cx="520" cy="70" rx="48" ry="22" />
            <ellipse cx="570" cy="58" rx="34" ry="18" />
            <ellipse cx="620" cy="68" rx="46" ry="22" />
          </g>
          <g className="cloud-drift" style={{ animationDelay: '-13s' }} fill="rgba(255,255,255,0.45)">
            <ellipse cx="700" cy="36" rx="36" ry="18" />
            <ellipse cx="738" cy="30" rx="24" ry="14" />
          </g>
        </svg>
      </div>

      <div className="absolute right-6 top-6 z-10 h-20 w-20 rounded-full bg-[#FFD166] shadow-[0_0_40px_rgba(255,209,102,0.55)]" aria-hidden="true" />

      <div className="absolute inset-x-0 top-[24%] z-0 h-[28%] bg-[linear-gradient(180deg,transparent_0%,rgba(46,196,182,0.12)_100%)]" />
      <div className="absolute inset-x-0 top-[30%] z-0 h-[18%]">
        <svg viewBox="0 0 800 120" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,70 C130,35 270,110 420,72 S640,32 800,70 L800,120 L0,120 Z" fill="#2EC4B6" />
        </svg>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-0 h-[40%] bg-[#FFF3D6]" />
      <div className="absolute inset-x-0 bottom-0 z-0 h-[10%] bg-[#F5DFA0]" />

      <div className="absolute bottom-0 left-0 z-10 hidden h-[35%] w-[28%] lg:block">
        <svg viewBox="0 0 220 260" className="h-full w-full" aria-hidden="true">
          <rect x="98" y="110" width="18" height="110" rx="8" fill="#6B3F1D" />
          <g className="leaf-sway">
            <path d="M110 120 C60 40, 10 10, 6 72" fill="none" stroke="#2E8B57" strokeWidth="10" strokeLinecap="round" />
            <path d="M110 120 C130 20, 190 10, 168 74" fill="none" stroke="#2E8B57" strokeWidth="10" strokeLinecap="round" />
            <path d="M110 120 C90 40, 40 40, 56 92" fill="none" stroke="#3CB371" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 120 C140 45, 180 45, 154 95" fill="none" stroke="#3CB371" strokeWidth="8" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 z-10 hidden h-[38%] w-[28%] lg:block">
        <svg viewBox="0 0 220 280" className="h-full w-full" aria-hidden="true">
          <rect x="104" y="110" width="18" height="110" rx="8" fill="#6B3F1D" />
          <g className="leaf-sway" style={{ animationDelay: '-1.6s' }}>
            <path d="M110 120 C60 35, 8 10, 8 78" fill="none" stroke="#2E8B57" strokeWidth="10" strokeLinecap="round" />
            <path d="M110 120 C145 25, 205 15, 176 78" fill="none" stroke="#2E8B57" strokeWidth="10" strokeLinecap="round" />
            <path d="M110 120 C90 42, 42 42, 58 94" fill="none" stroke="#3CB371" strokeWidth="8" strokeLinecap="round" />
            <path d="M110 120 C142 48, 188 48, 156 98" fill="none" stroke="#3CB371" strokeWidth="8" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      <div className="relative z-20 mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl items-center px-6 py-16 sm:px-8 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mx-auto max-w-3xl rounded-[32px] border border-white/70 bg-white/70 p-8 text-center shadow-[0_24px_70px_-24px_rgba(26,58,92,0.35)] backdrop-blur-md sm:p-10 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF6B6B]">Parth Pandit</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#1A3A5C] sm:text-5xl lg:text-6xl" style={{ fontFamily: 'var(--font-head)' }}>
            Creative developer with a bright beachside vibe.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#1A3A5C]/85 sm:text-lg">
            This fresh home page keeps the layout simple, readable, and responsive while the beach scene gives the portfolio personality.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="/projects" className="rounded-full bg-[#2EC4B6] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1A3A5C]">View Projects</a>
            <a href="/contact" className="rounded-full border border-[#1A3A5C]/20 bg-white/90 px-5 py-3 text-sm font-semibold text-[#1A3A5C] shadow-sm transition hover:bg-[#FFF3D6]">Contact Me</a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
