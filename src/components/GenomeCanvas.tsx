import React, { useRef, useEffect } from 'react'
import { useGenome } from '../state/useGenome'
import { drawGenome } from '../renderer/drawGenome'

export default function GenomeCanvas(){
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { genome, placeGene, selectedGene } = useGenome()

  useEffect(()=>{
    const c = canvasRef.current
    if(!c) return
    const dpr = window.devicePixelRatio || 1
    const rect = c.getBoundingClientRect()
    c.width = Math.floor(rect.width * dpr)
    c.height = Math.floor(rect.height * dpr)
    const ctx = c.getContext('2d')!
    ctx.setTransform(dpr,0,0,dpr,0,0)
    drawGenome(ctx, rect.width, rect.height, genome, {selectedGene})
  },[genome, selectedGene])

  return (
    <div className="canvas-wrap">
      <canvas ref={canvasRef} width={800} height={600} onClick={(e)=>{
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        placeGene({x,y})
      }} />
    </div>
  )
}
