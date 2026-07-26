import React, { useRef, useEffect } from 'react'
import { useGenome } from '../state/useGenome'
import { drawGenome } from '../renderer/drawGenome'
import { CANVAS_SIZE } from '../renderer/geometry'

export default function GenomeCanvas(){
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { genome, placeGene, selectedGene } = useGenome()

  useEffect(()=>{
    const c = canvasRef.current
    if(!c) return
    const dpr = window.devicePixelRatio || 1
    const rect = c.getBoundingClientRect()
    // stable internal coordinate system
    c.width = Math.max(1, Math.floor(CANVAS_SIZE * dpr))
    c.height = Math.max(1, Math.floor(CANVAS_SIZE * dpr))
    c.style.width = `${rect.width}px`
    c.style.height = `${rect.height}px`
    const ctx = c.getContext('2d')!
    ctx.setTransform(dpr,0,0,dpr,0,0)
    drawGenome(ctx, CANVAS_SIZE, CANVAS_SIZE, genome, {selectedGene})
  },[genome, selectedGene])

  useEffect(()=>{
    const c = canvasRef.current
    if(!c) return
    const onPointerDown = (e: PointerEvent) => {
      // prevent page scroll while interacting
      e.preventDefault()
      const rect = c.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      // map client coords to internal 680x680
      const x = ((e.clientX - rect.left) / rect.width) * CANVAS_SIZE
      const y = ((e.clientY - rect.top) / rect.height) * CANVAS_SIZE
      placeGene({x,y})
    }
    c.addEventListener('pointerdown', onPointerDown)
    return ()=> c.removeEventListener('pointerdown', onPointerDown)
  },[placeGene])

  return (
    <div className="canvas-wrap" style={{width: '100%', height: '100%'}}>
      <canvas ref={canvasRef} />
    </div>
  )
}
