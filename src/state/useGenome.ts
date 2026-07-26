import React, { createContext, useContext, useState } from 'react'
import { Genome, Gene } from '../types/genome'

type GenomeContext = {
  genome: Genome
  body: Genome['body']
  eye: Genome['eye']
  chi: number
  selectedGene: string
  translationFidelity: number
  bodyInfluence: number
  setBody: (b: Genome['body'])=>void
  setEye: (e: Genome['eye'])=>void
  setChi: (n:number)=>void
  placeGene: (pos:{x:number,y:number})=>void
  undo: ()=>void
  clear: ()=>void
  setSelectedGene: (g:string)=>void
  setTranslationFidelity: (n:number)=>void
  setBodyInfluence: (n:number)=>void
}

const initialGenome: Genome = {
  body: 'Seed',
  eye: 'Bright',
  rings: Array.from({length:6}).map(()=>({sockets: Array.from({length:16}).map(()=>({gene: null}))})),
}

const ctx = createContext<GenomeContext | undefined>(undefined)

export function GenomeProvider({children}:{children:React.ReactNode}){
  const [genome, setGenome] = useState<Genome>(initialGenome)
  const [body, setBody] = useState(genome.body)
  const [eye, setEye] = useState<Genome['eye']>(genome.eye || 'Bright')
  const [chi, setChi] = useState(3)
  const [selectedGene, setSelectedGene] = useState('bead')
  const [translationFidelity, setTranslationFidelity] = useState(80)
  const [bodyInfluence, setBodyInfluence] = useState(50)

  const history: Genome[] = []

  function placeGene(pos:{x:number,y:number}){
    // naive placement: map to nearest socket by angle/radius
    const cx = 400
    const cy = 300
    const dx = pos.x - cx
    const dy = pos.y - cy
    const angle = Math.atan2(dy,dx)
    const dist = Math.sqrt(dx*dx+dy*dy)
    const ringIndex = Math.max(0, Math.min(5, Math.floor((dist - 60) / 60)))
    const ring = genome.rings[ringIndex] || genome.rings[0]
    const n = ring.sockets.length
    const idx = Math.round(((angle + Math.PI/2) / (Math.PI*2)) * n) % n
    const newGenome = structuredClone(genome)
    newGenome.rings[ringIndex].sockets[idx].gene = {type: selectedGene}
    setGenome(newGenome)
  }

  function undo(){
    // simple clear last placed (not full stack) - placeholder
    // For now just clear all
    setGenome(initialGenome)
  }
  function clear(){ setGenome(initialGenome) }

  return (
    <ctx.Provider value={{genome, body, eye, chi, selectedGene, translationFidelity, bodyInfluence, setBody:(b)=>{setBody(b); setGenome(g=>({...g, body:b}))}, setEye:(e)=>{setEye(e); setGenome(g=>({...g, eye:e}))}, setChi, placeGene, undo, clear, setSelectedGene, setTranslationFidelity, setBodyInfluence}}>
      {children}
    </ctx.Provider>
  )
}

export function useGenome(){
  const v = useContext(ctx)
  if(!v) throw new Error('useGenome must be used inside provider')
  return v
}
