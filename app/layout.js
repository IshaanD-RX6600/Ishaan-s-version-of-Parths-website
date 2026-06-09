import './globals.css'
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

export const metadata = {
  title: 'Parth Pandit — Beachy Portfolio',
  description: 'A playful beach-inspired portfolio built with Next.js, Tailwind, and Framer Motion.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${righteous.variable} ${poppins.variable} bg-[#FFF3D6] text-[#1A3A5C] antialiased`}>{children}</body>
    </html>
  )
}
