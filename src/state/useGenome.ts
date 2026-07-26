import React, { createContext, useContext, useState, useRef } from 'react'
import { Genome, Gene, GeneType } from '../types/genome'
import { STEP_COUNT } from '../renderer/geometry'

type GenomeContext = {
  genome: Genome
  selectedGene: GeneType
  setSelectedGene: (g: GeneType)=>void
  updateAnatomy: (patch: Partial<Genome['anatomy']>)=>void
  placeGene: (pos:{x:number,y:number})=>void
  dreamGenome: ()=>void
  undo: ()=>void
  clear: ()=>void
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
  rings: Array.from({length:6}).map(()=>({sockets: Array.from({length:STEP_COUNT}).map(()=>({gene: null}))})),
  anatomy: {...defaultAnatomy}
})

const initialGenome = makeEmptyGenome()

const ctx = createContext<GenomeContext | undefined>(undefined)

export function GenomeProvider({children}:{children:React.ReactNode}){
  const [genome, setGenome] = useState<Genome>(initialGenome)
  const [selectedGene, setSelectedGene] = useState<GeneType>('bead')
  const historyRef = useRef<Genome[]>([])

  function pushHistory(current: Genome){
    historyRef.current = [...historyRef.current.slice(-59), structuredClone(current)]
  }

  function updateAnatomy(patch: Partial<Genome['anatomy']>){
    pushHistory(genome)
    setGenome(g=>({ ...structuredClone(g), anatomy: {...structuredClone(g.anatomy), ...patch} }))
  }

  function placeGene(pos:{x:number,y:number}){
    // find nearest socket
    // compute distances
    const cx = 680/2
    const cy = 680/2
    let best = {ring:0,step:0,dist:Infinity}
    genome.rings.forEach((r, ri)=>{
      r.sockets.forEach((s, si)=>{
        // compute socket position using socketPosition dynamically to avoid circular import
        // lazy require to prevent TS import cycles
      })
    })

    // import socketPosition dynamically
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { socketPosition } = require('../renderer/geometry')

    genome.rings.forEach((r, ri)=>{
      r.sockets.forEach((s, si)=>{
        const p = socketPosition(ri, si, cx, cy)
        const dx = p.x - pos.x
        const dy = p.y - pos.y
        const d2 = dx*dx + dy*dy
        if(d2 < best.dist){
          best = {ring: ri, step: si, dist: d2}
        }
      })
    })

    if(best.dist === Infinity) return
    pushHistory(genome)
    const ng = structuredClone(genome)
    ng.rings[best.ring].sockets[best.step].gene = {type: selectedGene, weight: 5}
    setGenome(ng)
  }

  function dreamGenome(){
    pushHistory(genome)
    const ng = structuredClone(genome)
    // clear genes but preserve anatomy
    ng.rings.forEach((r)=> r.sockets.forEach(s=> s.gene = null))
    // place 1-3 genes per ring
    const types: GeneType[] = ['bead','triangle','ring','stitch']
    ng.rings.forEach((r, ri)=>{
      const count = 1 + Math.floor(Math.random()*3)
      const chosen = new Set<number>()
      for(let i=0;i<count;i++){
        let slot
        do { slot = Math.floor(Math.random() * r.sockets.length) } while(chosen.has(slot))
        chosen.add(slot)
        const t = types[Math.floor(Math.random()*types.length)]
        r.sockets[slot].gene = {type: t, weight: 2 + Math.floor(Math.random()*6)}
      }
    })
    setGenome(ng)
  }

  function undo(){
    const h = historyRef.current
    if(h.length === 0) return
    const prev = h[h.length - 1]
    historyRef.current = h.slice(0, -1)
    setGenome(structuredClone(prev))
  }

  function clear(){
    pushHistory(genome)
    setGenome(makeEmptyGenome())
  }

  return (
    <ctx.Provider value={{genome, selectedGene, setSelectedGene, updateAnatomy, placeGene, dreamGenome, undo, clear}}>
      {children}
    </ctx.Provider>
  )
}

export function useGenome(){
  const v = useContext(ctx)
  if(!v) throw new Error('useGenome must be used inside provider')
  return v
}
