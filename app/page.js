'use client'

import Link from 'next/link'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import WaveDivider from './components/WaveDivider'

export default function Page() {
  return (
    <>
      <Navigation />
      <main className="relative overflow-hidden">
        <Hero />
        <WaveDivider accent="#FF6B6B" />
        <section className="px-8 pb-24">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {[
              ['About', '/about', 'A short portrait, the style direction, and the calm tone behind the interface.'],
              ['Projects', '/projects', 'A tidy collection of highlights, case studies, and launch-ready visuals.'],
              ['Skills', '/skills', 'The practical toolkit and feeling behind the work.'],
              ['Contact', '/contact', 'A direct next step for collaboration, launch support, or a chat.']
            ].map(([label, href, text]) => (
              <Link key={label} href={href} className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_-24px_rgba(26,58,92,0.24)] transition hover:-translate-y-1">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2EC4B6]">Route</p>
                <h2 className="mt-3 text-2xl font-semibold text-[#1A3A5C]" style={{ fontFamily: 'var(--font-head)' }}>{label}</h2>
                <p className="mt-3 text-base leading-8 text-[#1A3A5C]/80">{text}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
