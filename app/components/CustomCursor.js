'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <motion.div
      className="pointer-events-none fixed z-50 h-4 w-4 rounded-full border border-coral/80 bg-coral/20"
      animate={{ x: position.x - 8, y: position.y - 8, scale: [1, 1.3, 1] }}
      transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
    />
  )
}
