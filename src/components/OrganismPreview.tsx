import React, { useEffect, useRef } from 'react'
import { drawOrganism } from '../renderer/drawOrganism'
import { useGenome } from '../state/useGenome'

export default function OrganismPreview(){
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { genome } = useGenome()

  useEffect(()=>{
    const c = canvasRef.current
    if(!c) return
    const dpr = window.devicePixelRatio || 1
    const rect = c.getBoundingClientRect()
    c.width = Math.floor(rect.width * dpr)
    c.height = Math.floor(rect.height * dpr)
    const ctx = c.getContext('2d')!
    ctx.setTransform(dpr,0,0,dpr,0,0)
    drawOrganism(ctx, rect.width, rect.height, genome)
  },[genome])

  return (
    <div>
      <div className="panel-section">
        <div className="label">Living Translation</div>
        <canvas ref={canvasRef} width={280} height={220} style={{width:'100%', height:220}} />
      </div>
      <div className="panel-section">
        <div className="label">Manifest Preview</div>
        <pre style={{whiteSpace:'pre-wrap', fontSize:12}}>{JSON.stringify(genome, null, 2)}</pre>
      </div>
    </div>
  )
}
