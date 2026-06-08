import './globals.css'
import { Playfair_Display, DM_Sans } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-head',
  display: 'swap',
  weight: ['500', '600', '700', '800']
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700']
})

export const metadata = {
  title: 'Parth Pandit — Beachfront Portfolio',
  description: 'A cinematic beach-inspired portfolio built with Next.js, Tailwind, Framer Motion, and Three.js.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable} bg-sand text-driftwood`}>{children}</body>
    </html>
  )
}
