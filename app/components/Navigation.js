'use client'

import { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const navLinks = [
  { label: 'Shore', href: '#hero' },
  { label: 'Tide', href: '#about' },
  { label: 'Reef', href: '#work' },
  { label: 'Horizon', href: '#contact' }
]

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()
  const background = useTransform(scrollY, [0, 100], ['rgba(245,236,215,0)', 'rgba(245,236,215,0.96)'])

  return (
    <motion.nav
      style={{ background }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/15 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <a href="#hero" className="font-semibold tracking-[0.28em] text-ocean/90">
          PARTH
        </a>

        <button
          type="button"
          aria-label="Toggle navigation"
          className="inline-flex items-center gap-1 rounded-full border border-ocean/15 bg-white/90 px-4 py-2 text-sm font-medium text-ocean shadow-sm shadow-ocean/5 backdrop-blur-sm sm:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <div className="hidden items-center gap-8 sm:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-driftwood transition hover:text-ocean">
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/15 bg-sand/95 px-6 pb-6 pt-4 sm:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-3xl bg-white/80 px-4 py-3 text-sm font-medium text-ocean transition hover:bg-ocean/10"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </motion.nav>
  )
}
