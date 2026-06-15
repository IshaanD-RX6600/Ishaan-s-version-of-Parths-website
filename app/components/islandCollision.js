// Runtime island collision.
//
// The mask is baked from the ACTUAL islands.glb mesh after it loads, in the same
// world space it's rendered in — so the blocked cells line up exactly with the
// land you can see. (Baking a grid offline drifted out of alignment: the boat
// sailed through visible rock and bumped invisible walls in open water.)
//
// HOW WE DECIDE "LAND": not by an absolute height. islands.glb's beaches sit at
// wildly different elevations — `about`/`contact` sand is around y +0.5 while the
// low `home` and `skills` sandbars barely clear the water at y −1.8 / −2.4 — and
// the cream-vs-turquoise look is painted into the texture, not derived from
// height. So any single height threshold either lets the boat drive over the low
// sandbars or walls off open lagoon. Instead we compare two surfaces: the terrain
// (sand + rock) and the model's own `Acqua` water mesh. A cell is land wherever
// the terrain pokes ABOVE the local water surface — exactly the shoreline you
// see, at every island regardless of its elevation. Sharks sit under the water,
// so they're baked in separately by shape.

import * as THREE from 'three'

// Soft limit so the boat can't sail off into the empty ocean forever.
export const WORLD_BOUND = 52

<<<<<<< HEAD
// Terrain must clear the water surface by this much (world units) to count as
// land. 0 = the exact waterline. Kept at 0 so the barely-emergent `home` sandbar
// (only ~0.08 above water) is still walled off; the boat can sail right up to any
// shore but not onto it.
const SHORE_MARGIN = 0.0

// Water level used for a land cell the `Acqua` mesh doesn't cover (rare — it
// blankets the whole archipelago). Matches the procedural ocean plane.
const WATER_FALLBACK = -3.6

// Meshes that must never block: decorative canopy/props (you sail under/past
// them) and stray geometry floating high above the scene (a top-down bake would
// otherwise stamp a phantom wall into open water beneath it).
const SKIP_NAME = /Foglia|palma|bottiglia|foglio/i
const FLOAT_CEILING = 10
=======
// World Y above which the island surface counts as solid land.
//
// islands.glb is NOT islands-on-flat-sea: a single continuous `Sabbia` (sand)
// mesh forms both the navigable lagoon floor AND the islands — the islands are
// just where that sand rises above the waterline. Verified per-cell heights
// (water `Acqua` mesh excluded): the lagoon floor sits below ≈ -1.6, while the
// visible sand beaches and rocks rise above it (peaks to +22). So thresholding
// the surface height traces the real shoreline: the whole archipelago (sand +
// rocks) becomes solid while every channel, berth and the open ocean stays
// passable. The OLD value (+1.0) only caught the high rock peaks (~5% of the
// map), so the boat sailed straight over every sand beach — the bug this fixes.
// Successively lowered (-1.5 → -1.7 → -1.9) to swallow the gently-sloping
// wet-sand spits at the island fringes the boat kept nosing onto. -1.9 is the
// floor: lower and the `contact` berth falls outside DOCK_RADIUS (8.5) and the
// lagoon channels start to wall up.
const LAND_HEIGHT = -1.9

// Meshes that must NOT contribute to the land mask, matched on node OR material
// name. `Acqua` is the animated sea surface — its wave crests reach y ≈ -1.2,
// so at our threshold it would paint false walls across open water. `Foglia` /
// `palmafoglia` are palm fronds that overhang the water at y up to +6; a
// top-down rasterisation would block the clear water beneath them (the "stuck
// on plain water near the shore" bug). Everything else (sand, rocks, wreck) is
// kept.
const EXCLUDE_FROM_LAND = /acqua|foglia/i

// Sharks: discrete obstacles that sit submerged in open water (the `Cylinder.*`
// meshes — ~7×3.5 elongated bodies scattered across the lagoon). Only their
// dorsal tips poke above LAND_HEIGHT, so the height test alone barely catches
// them and the boat slides through. These meshes are rasterised by their FULL
// top-down footprint (height-independent) so the whole shark body is solid.
// Matched on node name; palm trunks ("palma_tronco…") don't match. The handful
// of on-land `Cylinder` props (barrels) are already inside blocked land, so
// footprint-marking them is harmless.
const SHARK_OBSTACLE = /cylinder/i
>>>>>>> 41465f0940a35a270e98bb7ef17e7e0b0f766c99

// Installed once the mesh is baked. { grid:Uint8Array, G, R }
let OCC = null

export function hasOccupancy() {
  return OCC != null
}

<<<<<<< HEAD
// Is world point (x, z) inside an island / shark (blocked)? Open ocean → false.
=======
// The baked grid + dims, for the minimap to draw. Cells: 0 water, 1 land, 2 shark.
export function getOccupancy() {
  return OCC
}

// Is world point (x, z) inside an island or shark (blocked)? Open ocean → false.
>>>>>>> 41465f0940a35a270e98bb7ef17e7e0b0f766c99
export function isBlocked(x, z) {
  if (!OCC) return false
  const { grid, G, R } = OCC
  const col = Math.floor(((x + R) / (2 * R)) * G)
  const row = Math.floor(((z + R) / (2 * R)) * G)
  if (col < 0 || col >= G || row < 0 || row >= G) return false
  return grid[row * G + col] !== 0
}

// A submerged cylinder body with a long, broad footprint is a shark — block its
// whole shape (it sits under the water, so the sand-above-water test misses it).
// Barrels are cylinders too but tiny; the water plane is huge but not one.
function isSharkMesh(name, box) {
  if (!/^Cylinder/.test(name)) return false
  const span = Math.max(box.max.x - box.min.x, box.max.z - box.min.z)
  return box.max.y < WMAX_GUESS && span >= 3.5 && span <= 15
}
// Sharks peak ≈ −0.9; the water tops out ≈ −1.3. Treat anything fully below this
// as "submerged" for shark detection.
const WMAX_GUESS = -0.7

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

<<<<<<< HEAD
// Rasterise every triangle of `o` top-down into `grid`, keeping the MAX surface
// height per cell. Used for both the terrain and the water surfaces.
function rasterMaxHeight(o, grid, G, R, a, b, c) {
  const pos = o.geometry.attributes.position
  const index = o.geometry.index
  const m = o.matrixWorld
  const count = index ? index.count : pos.count
  const toCol = (x) => ((x + R) / (2 * R)) * G
  const toRow = (z) => ((z + R) / (2 * R)) * G
  const load = (vec, ix) => vec.set(pos.getX(ix), pos.getY(ix), pos.getZ(ix)).applyMatrix4(m)

  for (let i = 0; i < count; i += 3) {
    const i0 = index ? index.getX(i) : i
    const i1 = index ? index.getX(i + 1) : i + 1
    const i2 = index ? index.getX(i + 2) : i + 2
    load(a, i0); load(b, i1); load(c, i2)

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
        const y = l1 * a.y + l2 * b.y + l3 * c.y
        const idx = r * G + col
        if (y > grid[idx]) grid[idx] = y
      }
    }
  }
}

// Rasterise every triangle of `o` into `mask` (set cell = 1), ignoring height.
// Used for sharks, which block their whole footprint.
function rasterMask(o, mask, G, R, a, b, c) {
  const pos = o.geometry.attributes.position
  const index = o.geometry.index
  const m = o.matrixWorld
  const count = index ? index.count : pos.count
  const toCol = (x) => ((x + R) / (2 * R)) * G
  const toRow = (z) => ((z + R) / (2 * R)) * G
  const load = (vec, ix) => vec.set(pos.getX(ix), pos.getY(ix), pos.getZ(ix)).applyMatrix4(m)

  for (let i = 0; i < count; i += 3) {
    const i0 = index ? index.getX(i) : i
    const i1 = index ? index.getX(i + 1) : i + 1
    const i2 = index ? index.getX(i + 2) : i + 2
    load(a, i0); load(b, i1); load(c, i2)
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
        mask[r * G + col] = 1
      }
    }
  }
}

// Bake the collision mask from `root` (the placed island Object3D). A cell is
// blocked where the terrain rises above the local water surface, or where a
// shark sits. Then the mask is inflated a touch for hull clearance. Returns the
// occupancy and installs it for isBlocked().
//
// G=256 over world ±R gives ~0.375-unit cells, so the wall tracks the curved
// shoreline closely instead of in coarse steps that snag the hull.
export function buildOccupancy(root, { G = 256, R = 48, inflate = 2 } = {}) {
  const land = new Float32Array(G * G).fill(-99) // terrain (sand + rock) max height
  const water = new Float32Array(G * G).fill(-99) // Acqua water-surface max height
  const sharks = new Uint8Array(G * G)
  let waterCells = 0

=======
// Bake the land mask from `root` (the placed island Object3D). Rasterises each
// above-water triangle into a G×G grid over world ±R, then inflates for hull
// clearance. Returns the occupancy and installs it for isBlocked().
export function buildOccupancy(root, { G = 128, R = 48, inflate = 1 } = {}) {
  let grid = new Uint8Array(G * G)
  const sharkCells = [] // applied AFTER inflate so sharks stay tight (value 2)
>>>>>>> 41465f0940a35a270e98bb7ef17e7e0b0f766c99
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  const box = new THREE.Box3()

  root.updateWorldMatrix(true, true)
  root.traverse((o) => {
    const geom = o.isMesh && o.geometry
    const pos = geom && geom.attributes && geom.attributes.position
    if (!pos) return
<<<<<<< HEAD
    const name = o.name || ''

    if (/Acqua/i.test(name)) { rasterMaxHeight(o, water, G, R, a, b, c); return }
    if (SKIP_NAME.test(name)) return
=======
    // Skip the sea surface and overhanging palm fronds — see EXCLUDE_FROM_LAND.
    if (EXCLUDE_FROM_LAND.test(o.name || '') || EXCLUDE_FROM_LAND.test(o.material?.name || '')) return
    // Sharks are solid by their whole footprint, not just the bit above water.
    const shark = SHARK_OBSTACLE.test(o.name || '')
    const index = geom.index
    const m = o.matrixWorld
    const count = index ? index.count : pos.count
    const load = (vec, ix) => vec.set(pos.getX(ix), pos.getY(ix), pos.getZ(ix)).applyMatrix4(m)

    for (let i = 0; i < count; i += 3) {
      const i0 = index ? index.getX(i) : i
      const i1 = index ? index.getX(i + 1) : i + 1
      const i2 = index ? index.getX(i + 2) : i + 2
      load(a, i0); load(b, i1); load(c, i2)
      // Skip triangles that lie entirely on the low base terrain / sea floor
      // (but a shark counts everywhere, however deep it sits).
      if (!shark && a.y < LAND_HEIGHT && b.y < LAND_HEIGHT && c.y < LAND_HEIGHT) continue
>>>>>>> 41465f0940a35a270e98bb7ef17e7e0b0f766c99

    geom.computeBoundingBox()
    box.copy(geom.boundingBox).applyMatrix4(o.matrixWorld)
    if (box.min.y > FLOAT_CEILING) return // stray geometry hovering over the map

<<<<<<< HEAD
    if (isSharkMesh(name, box)) rasterMask(o, sharks, G, R, a, b, c)
    else rasterMaxHeight(o, land, G, R, a, b, c)
  })

  for (let i = 0; i < G * G; i++) if (water[i] > -90) waterCells++
  const useWater = waterCells > G * G * 0.1 // Acqua found → compare per-cell

  let grid = new Uint8Array(G * G)
  for (let i = 0; i < G * G; i++) {
    if (sharks[i]) { grid[i] = 1; continue }
    if (land[i] < -90) continue // no terrain here → open water
    const wl = useWater ? (water[i] > -90 ? water[i] : WATER_FALLBACK) : -1.5
    if (land[i] >= wl + SHORE_MARGIN) grid[i] = 1
  }

=======
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
          // Sharks block wherever their footprint falls (collected, applied
          // after inflate); land only where the interpolated surface rises
          // above the base terrain into an island.
          if (shark) sharkCells.push(r * G + col)
          else if (l1 * a.y + l2 * b.y + l3 * c.y >= LAND_HEIGHT) grid[r * G + col] = 1
        }
      }
    }
  })

  // Grow only the land for hull clearance, THEN stamp the sharks (value 2) so
  // they stay their true size and the minimap can tell land from hazard.
>>>>>>> 41465f0940a35a270e98bb7ef17e7e0b0f766c99
  for (let n = 0; n < inflate; n++) grid = inflateOnce(grid, G)
  for (const k of sharkCells) if (grid[k] === 0) grid[k] = 2

  OCC = { grid, G, R }
  return OCC
}
