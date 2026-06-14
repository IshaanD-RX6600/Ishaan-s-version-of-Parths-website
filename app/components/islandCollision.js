// Runtime island collision.
//
// The mask is baked from the ACTUAL islands.glb mesh after it loads, in the same
// world space it's rendered in — so the blocked cells line up exactly with the
// land you can see. (The old approach baked a grid offline, which drifted out of
// alignment: the boat sailed through visible rock and bumped invisible walls in
// open water.) We rasterise every above-water triangle top-down into a grid and
// mark a cell as land where the island surface pokes above the sea.

import * as THREE from 'three'

// Soft limit so the boat can't sail off into the empty ocean forever.
export const WORLD_BOUND = 52

// World Y above which geometry counts as a real island.
//
// islands.glb is NOT just islands + flat sea: it has a continuous low base
// terrain blanketing the whole area at y ≈ -2..-1 (verified: world-Y spans
// -5.72..22.40, and most surfaced cells top out at -2..-1). That base is the
// navigable lagoon floor — only the actual landmasses rise above it (peaks to
// +22). Thresholding at +1 isolates those islands (~5% of the map) and leaves
// every channel, berth and the open ocean passable. Anything lower would wall
// off the water the boat sails on.
const LAND_HEIGHT = 1.0

// Installed once the mesh is baked. { grid:Uint8Array, G, R }
let OCC = null

export function hasOccupancy() {
  return OCC != null
}

// Is world point (x, z) inside an island (blocked)? Open ocean → false.
export function isBlocked(x, z) {
  if (!OCC) return false
  const { grid, G, R } = OCC
  const col = Math.floor(((x + R) / (2 * R)) * G)
  const row = Math.floor(((z + R) / (2 * R)) * G)
  if (col < 0 || col >= G || row < 0 || row >= G) return false
  return grid[row * G + col] === 1
}

function inflateOnce(grid, G) {
  const out = grid.slice()
  for (let r = 0; r < G; r++) {
    for (let c = 0; c < G; c++) {
      if (grid[r * G + c]) continue
      let hit = false
      for (let dr = -1; dr <= 1 && !hit; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const rr = r + dr
          const cc = c + dc
          if (rr < 0 || rr >= G || cc < 0 || cc >= G) continue
          if (grid[rr * G + cc]) { hit = true; break }
        }
      }
      if (hit) out[r * G + c] = 1
    }
  }
  return out
}

// Bake the land mask from `root` (the placed island Object3D). Rasterises each
// above-water triangle into a G×G grid over world ±R, then inflates for hull
// clearance. Returns the occupancy and installs it for isBlocked().
export function buildOccupancy(root, { G = 128, R = 48, inflate = 2 } = {}) {
  let grid = new Uint8Array(G * G)
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  const toCol = (x) => ((x + R) / (2 * R)) * G
  const toRow = (z) => ((z + R) / (2 * R)) * G

  root.updateWorldMatrix(true, true)
  root.traverse((o) => {
    const geom = o.isMesh && o.geometry
    const pos = geom && geom.attributes && geom.attributes.position
    if (!pos) return
    const index = geom.index
    const m = o.matrixWorld
    const count = index ? index.count : pos.count
    const load = (vec, ix) => vec.set(pos.getX(ix), pos.getY(ix), pos.getZ(ix)).applyMatrix4(m)

    for (let i = 0; i < count; i += 3) {
      const i0 = index ? index.getX(i) : i
      const i1 = index ? index.getX(i + 1) : i + 1
      const i2 = index ? index.getX(i + 2) : i + 2
      load(a, i0); load(b, i1); load(c, i2)
      // Skip triangles that lie entirely on the low base terrain / sea floor.
      if (a.y < LAND_HEIGHT && b.y < LAND_HEIGHT && c.y < LAND_HEIGHT) continue

      const ax = toCol(a.x), az = toRow(a.z)
      const bx = toCol(b.x), bz = toRow(b.z)
      const cx = toCol(c.x), cz = toRow(c.z)
      const det = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz)
      if (Math.abs(det) < 1e-9) continue

      const minC = Math.max(0, Math.floor(Math.min(ax, bx, cx)))
      const maxC = Math.min(G - 1, Math.ceil(Math.max(ax, bx, cx)))
      const minR = Math.max(0, Math.floor(Math.min(az, bz, cz)))
      const maxR = Math.min(G - 1, Math.ceil(Math.max(az, bz, cz)))

      for (let r = minR; r <= maxR; r++) {
        const py = r + 0.5
        for (let col = minC; col <= maxC; col++) {
          const px = col + 0.5
          const l1 = ((bz - cz) * (px - cx) + (cx - bx) * (py - cz)) / det
          const l2 = ((cz - az) * (px - cx) + (ax - cx) * (py - cz)) / det
          const l3 = 1 - l1 - l2
          if (l1 < -0.02 || l2 < -0.02 || l3 < -0.02) continue
          // Interpolated surface height at this cell — land only if it rises
          // above the base terrain into a real island.
          if (l1 * a.y + l2 * b.y + l3 * c.y >= LAND_HEIGHT) grid[r * G + col] = 1
        }
      }
    }
  })

  for (let n = 0; n < inflate; n++) grid = inflateOnce(grid, G)

  OCC = { grid, G, R }
  return OCC
}
