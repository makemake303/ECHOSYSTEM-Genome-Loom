import React, { createContext, useContext, useState, useRef } from 'react'
import { Genome, Gene, GeneType } from '../types/genome'
import {
  CANVAS_SIZE,
  STEP_COUNT,
  socketPosition,
} from '../renderer/geometry'

type GenomeContext = {
  genome: Genome
  selectedGene: GeneType
  setSelectedGene: (g: GeneType) => void
  updateAnatomy: (patch: Partial<Genome['anatomy']>) => void
  placeGene: (pos: { x: number; y: number }) => void
  dreamGenome: () => void
  undo: () => void
  clear: () => void
}

const defaultAnatomy = {
  body: 'Seed' as const,
  eye: 'Bright' as const,
  chiForm: 'Orbiting Beads' as const,
  chiMotion: 'Orbit' as const,
  chiDensity: 8,
  translationFidelity: 80,
  bodyInfluence: 50,
  bpm: 90,
}

const makeEmptyGenome = (): Genome => ({
  rings: Array.from({ length: 6 }).map(() => ({ sockets: Array.from({ length: STEP_COUNT }).map(() => ({ gene: null })) })),
  anatomy: { ...defaultAnatomy },
})

const initialGenome = makeEmptyGenome()

const ctx = createContext<GenomeContext | undefined>(undefined)

function cloneGenome(value: Genome): Genome {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }
  return JSON.parse(JSON.stringify(value)) as Genome
}

export function GenomeProvider({ children }: { children: React.ReactNode }) {
  const [genome, setGenome] = useState<Genome>(initialGenome)
  const [selectedGene, setSelectedGene] = useState<GeneType>('bead')
  const historyRef = useRef<Genome[]>([])

  function pushHistory(current: Genome) {
    historyRef.current = [...historyRef.current.slice(-59), cloneGenome(current)]
  }

  function updateAnatomy(patch: Partial<Genome['anatomy']>) {
    pushHistory(genome)
    setGenome((g) => {
      const next = cloneGenome(g)
      next.anatomy = { ...next.anatomy, ...patch }
      return next
    })
  }

  function placeGene(pos: { x: number; y: number }) {
    const cx = CANVAS_SIZE / 2
    const cy = CANVAS_SIZE / 2
    let best = { ring: 0, step: 0, dist: Infinity }

    genome.rings.forEach((ring, ringIndex) => {
      ring.sockets.forEach((_, stepIndex) => {
        const p = socketPosition(ringIndex, stepIndex, cx, cy)
        const dx = p.x - pos.x
        const dy = p.y - pos.y
        const d2 = dx * dx + dy * dy
        if (d2 < best.dist) {
          best = { ring: ringIndex, step: stepIndex, dist: d2 }
        }
      })
    })

    if (best.dist === Infinity) return
    pushHistory(genome)
    const ng = cloneGenome(genome)
    ng.rings[best.ring].sockets[best.step].gene = { type: selectedGene, weight: 5 }
    setGenome(ng)
  }

  function dreamGenome() {
    pushHistory(genome)
    const ng = cloneGenome(genome)
    // clear genes but preserve anatomy
    ng.rings.forEach((r) => r.sockets.forEach((s) => (s.gene = null)))
    // place 1-3 genes per ring
    const types: GeneType[] = ['bead', 'triangle', 'ring', 'stitch']
    ng.rings.forEach((r) => {
      const count = 1 + Math.floor(Math.random() * 3)
      const chosen = new Set<number>()
      for (let i = 0; i < count; i++) {
        let slot
        do {
          slot = Math.floor(Math.random() * r.sockets.length)
        } while (chosen.has(slot))
        chosen.add(slot)
        const t = types[Math.floor(Math.random() * types.length)]
        r.sockets[slot].gene = { type: t, weight: 2 + Math.floor(Math.random() * 6) }
      }
    })
    setGenome(ng)
  }

  function undo() {
    const h = historyRef.current
    if (h.length === 0) return
    const prev = h[h.length - 1]
    historyRef.current = h.slice(0, -1)
    setGenome(cloneGenome(prev))
  }

  function clear() {
    pushHistory(genome)
    setGenome((current) => {
      const next = cloneGenome(current)
      // preserve anatomy, clear genes
      next.rings.forEach((r) => r.sockets.forEach((s) => (s.gene = null)))
      return next
    })
  }

  return (
    <ctx.Provider value={{ genome, selectedGene, setSelectedGene, updateAnatomy, placeGene, dreamGenome, undo, clear }}>
      {children}
    </ctx.Provider>
  )
}

export function useGenome() {
  const v = useContext(ctx)
  if (!v) throw new Error('useGenome must be used inside provider')
  return v
}
