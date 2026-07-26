import React, { useEffect, useRef } from 'react'
import { drawOrganism } from '../renderer/drawOrganism'
import { useGenome } from '../state/useGenome'

export default function OrganismPreview(){
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { genome } = useGenome()
  const animRef = useRef<number | null>(null)

  useEffect(()=>{
    const c = canvasRef.current
    if(!c) return
    const dpr = window.devicePixelRatio || 1
    const width = 360
    const height = 440
    c.width = Math.floor(width * dpr)
    c.height = Math.floor(height * dpr)
    c.style.width = `${width}px`
    c.style.height = `${height}px`
    const ctx = c.getContext('2d')!
    ctx.setTransform(dpr,0,0,dpr,0,0)

    let mounted = true
    const render = (time: number) => {
      if(!mounted) return
      drawOrganism(ctx, width, height, genome, time)
      animRef.current = requestAnimationFrame(render)
    }
    animRef.current = requestAnimationFrame(render)

    return ()=>{
      mounted = false
      if(animRef.current) cancelAnimationFrame(animRef.current)
    }
  },[genome])

  return (
    <div>
      <div className="panel-section">
        <div className="label">Living Translation</div>
        <div style={{position:'relative', width:360}}>
          <div style={{position:'absolute', inset:0, borderRadius:8, pointerEvents:'none', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.03)'}} />
          <canvas ref={canvasRef} style={{background:'transparent', borderRadius:8}} />
        </div>
      </div>
      <div className="panel-section">
        <div className="label">Manifest Preview</div>
        <pre style={{whiteSpace:'pre-wrap', fontSize:12}}>{JSON.stringify(genome, null, 2)}</pre>
      </div>
    </div>
  )
}
