'use client'

import './globals.css'
import Link from 'next/link'
import { Righteous, Poppins } from 'next/font/google'

const righteous = Righteous({
  subsets: ['latin'],
  variable: '--font-head',
  display: 'swap',
  weight: ['400']
})

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700']
})

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/skills', label: 'Skills' },
  { href: '/contact', label: 'Contact' }
]

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${righteous.variable} ${poppins.variable} min-h-screen bg-[#FFF3D6] text-[#1A3A5C] antialiased`}>
        <div className="min-h-screen bg-[#FFF3D6] text-[#1A3A5C]">
          <header className="sticky top-0 z-20 border-b border-white/70 bg-[#FFF3D6]/95 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
              <Link href="/" className="text-xl font-semibold tracking-wide text-[#1A3A5C]" style={{ fontFamily: 'var(--font-head)' }}>
                Parth Portfolio
              </Link>
              <ul className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[#1A3A5C] sm:gap-4">
                {links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="rounded-full px-3 py-2 transition hover:bg-white/70 hover:text-[#FF6B6B]">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
