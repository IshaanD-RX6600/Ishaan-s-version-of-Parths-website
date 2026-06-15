'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

import { ISLANDS, boatState } from './Journey'
import { getOccupancy } from './islandCollision'

const COLLAPSED = 132 // px
const EXPANDED = 250
const RES = 256 // fixed canvas bitmap; CSS scales it to the display size

// world (x,z) → [0,1] fraction across the map (R = grid half-extent, 48)
function uv(x, z, R) {
  return [(x + R) / (2 * R), (z + R) / (2 * R)]
}

// Paint the baked occupancy once it's available: 1 = sand island, 2 = shark.
function drawMap(canvas, occ) {
  const { grid, G } = occ
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, RES, RES)
  const cell = RES / G
  for (let r = 0; r < G; r++) {
    for (let c = 0; c < G; c++) {
      const v = grid[r * G + c]
      if (!v) continue
      ctx.fillStyle = v === 2 ? 'rgba(70,82,104,0.8)' : '#ecd6a6'
      ctx.fillRect(c * cell, r * cell, cell + 0.7, cell + 0.7)
    }
  }
}

export default function Minimap() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(false)
  const canvasRef = useRef(null)
  const boatRef = useRef(null)
  const sizeRef = useRef(COLLAPSED)
  const drawnRef = useRef(false)

  const size = expanded ? EXPANDED : COLLAPSED
  sizeRef.current = size

  // Coming back to the map remounts a fresh (blank) canvas — force a redraw.
  useEffect(() => {
    if (pathname === '/') drawnRef.current = false
  }, [pathname])

  useEffect(() => {
    let raf
    const tick = () => {
      const cv = canvasRef.current
      if (cv && !drawnRef.current) {
        const occ = getOccupancy()
        if (occ) {
          drawMap(cv, occ)
          drawnRef.current = true
        }
      }
      const marker = boatRef.current
      if (marker) {
        const R = getOccupancy()?.R ?? 48
        const [u, v] = uv(boatState.x, boatState.z, R)
        const px = Math.max(0, Math.min(1, u)) * sizeRef.current
        const py = Math.max(0, Math.min(1, v)) * sizeRef.current
        // marker points "up" (north / −z) at rest; rotate it along the heading
        const rot = (Math.atan2(Math.sin(boatState.yaw), -Math.cos(boatState.yaw)) * 180) / Math.PI
        marker.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%) rotate(${rot}deg)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (pathname !== '/') return null // only while sailing the map

  const R = getOccupancy()?.R ?? 48

  return (
    <div
      onClick={() => setExpanded((e) => !e)}
      className="fixed left-4 top-20 z-40 cursor-pointer select-none overflow-hidden rounded-2xl border border-white/40 bg-[#7fc4dd] shadow-[0_14px_40px_-12px_rgba(13,59,94,0.85)] backdrop-blur-md transition-all duration-300 ease-out"
      style={{ width: size, height: size }}
      title={expanded ? 'Click to shrink the map' : 'Click to enlarge the map'}
      aria-label="Map of the islands"
    >
      <canvas ref={canvasRef} width={RES} height={RES} className="absolute inset-0 h-full w-full" />

      {/* island name labels — only legible (and only shown) when enlarged */}
      {expanded &&
        ISLANDS.map((isl) => {
          const [u, v] = uv(isl.center[0], isl.center[1], R)
          return (
            <span
              key={isl.key}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-ocean/75 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow"
              style={{ left: `${u * 100}%`, top: `${v * 100}%` }}
            >
              {isl.name}
            </span>
          )
        })}

      {/* the player's live position */}
      <div ref={boatRef} className="pointer-events-none absolute left-0 top-0 will-change-transform">
        <svg width="13" height="13" viewBox="0 0 12 12" aria-hidden>
          <path
            d="M6 0 L10.5 11 L6 8.4 L1.5 11 Z"
            fill="#ff5a3c"
            stroke="#fff"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* legend hint */}
      <span className="pointer-events-none absolute bottom-1 right-2 text-[8px] font-semibold uppercase tracking-wider text-white/80">
        {expanded ? 'Map' : 'Map ⤢'}
      </span>
    </div>
  )
}
