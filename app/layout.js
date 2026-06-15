'use client'

import './globals.css'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Righteous, Poppins } from 'next/font/google'
import PageTransition from './components/PageTransition'
import { JourneyProvider, JourneyOverlay } from './components/Journey'

const Scene3D = dynamic(() => import('./components/Scene3D'), { ssr: false })
const Minimap = dynamic(() => import('./components/Minimap'), { ssr: false })

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
      <body className={`${righteous.variable} ${poppins.variable} min-h-screen antialiased`}>
        <JourneyProvider>
          {/* Fixed 3D scene — drives the boat journey, rendered client-side only */}
          <Scene3D />
          <Minimap />

          <div className="relative min-h-screen">
            <header className="sticky top-0 z-20 border-b border-white/20 bg-white/10 backdrop-blur-md">
              <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
                <Link
                  href="/"
                  className="text-xl font-semibold tracking-wide text-white drop-shadow-md"
                  style={{ fontFamily: 'var(--font-head)' }}
                >
                  Parth
                </Link>
                <ul className="flex flex-wrap items-center gap-3 text-sm font-semibold sm:gap-4">
                  {links.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="rounded-full px-3 py-2 text-white drop-shadow transition hover:bg-white/20 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </header>

            <main>
              <PageTransition>{children}</PageTransition>
            </main>
          </div>

          <JourneyOverlay />
        </JourneyProvider>
      </body>
    </html>
  )
}
