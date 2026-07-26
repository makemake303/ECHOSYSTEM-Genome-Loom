import { Genome } from '../types/genome'
import { socketPosition } from './geometry'

function compressionForChi(chiDensity: number) {
  return Math.max(0.45, 1 - Math.max(0, chiDensity - 5) * 0.032)
}

export function drawOrganism(ctx: CanvasRenderingContext2D, width:number, height:number, genome: Genome, time:number){
  // transparent background
  ctx.clearRect(0,0,width,height)

  // clip to sprite region
  ctx.save()
  ctx.beginPath()
  ctx.rect(28, 28, 304, 384)
  ctx.clip()

  // draw neutral background within canvas (transparent outside)
  ctx.fillStyle = 'rgba(5,33,40,0.0)'
  ctx.fillRect(0,0,width,height)

  const centerX = 360/2
  const centerY = 440/2

  // anatomy
  const a = genome.anatomy
  const phase = (time / 60000) * a.bpm * Math.PI * 2
  const influence = a.bodyInfluence / 100
  const breathe = 1 + Math.sin(phase) * 0.04 * influence

  // body
  ctx.fillStyle = '#7dd3fc'
  const bw = 40 * breathe
  const bh = 50 * breathe
  if(a.body === 'Seed'){
    ctx.beginPath(); ctx.ellipse(centerX, centerY, bw, bh, 0, 0, Math.PI*2); ctx.fill()
  } else if(a.body === 'Orb'){
    ctx.beginPath(); ctx.arc(centerX, centerY, 44 * breathe, 0, Math.PI*2); ctx.fill()
  } else if(a.body === 'Square'){
    ctx.fillRect(centerX - 38 * breathe, centerY - 38 * breathe, 76 * breathe, 76 * breathe)
  } else {
    ctx.beginPath(); ctx.moveTo(centerX, centerY - 46 * breathe); ctx.lineTo(centerX + 42 * breathe, centerY + 36 * breathe); ctx.lineTo(centerX - 42 * breathe, centerY + 36 * breathe); ctx.closePath(); ctx.fill()
  }

  // eyes
  ctx.fillStyle = '#071827'
  const eyeCount = a.eye === 'Three' ? 3 : 2
  for(let i=0;i<eyeCount;i++){
    const ex = centerX + (i-(eyeCount-1)/2)*22
    const ey = centerY-8
    ctx.beginPath(); ctx.arc(ex,ey,8,0,Math.PI*2); ctx.fill()
  }

  // chi rendering: simplistic initial implementations
  const compression = compressionForChi(a.chiDensity)
  const chiRadiusBase = 60 * compression
  const chiCount = Math.max(4, Math.floor(a.chiDensity))

  for(let i=0;i<chiCount;i++){
    const t = i / chiCount
    let angle = t * Math.PI * 2
    // apply motion
    if(a.chiMotion === 'Orbit') angle += (time/5000)
    if(a.chiMotion === 'Counter-rotate') angle -= (time/5000)
    let radius = chiRadiusBase
    if(a.chiMotion === 'Breathe') radius *= 1 + Math.sin(time/600) * 0.06
    if(a.chiMotion === 'Drift') radius += Math.sin(time/500 + i) * 4
    if(a.chiMotion === 'Pulse') radius *= 1 + Math.sin(time/300 + i) * 0.08

    const cx = centerX + Math.cos(angle) * radius
    const cy = centerY + Math.sin(angle) * radius

    if(a.chiForm === 'Orbiting Beads'){
      ctx.fillStyle = '#fffb'
      ctx.beginPath(); ctx.arc(cx,cy,3,0,Math.PI*2); ctx.fill()
    } else if(a.chiForm === 'Halo'){
      ctx.strokeStyle = 'rgba(125,211,252,0.12)'
      ctx.beginPath(); ctx.arc(centerX,centerY,radius,0,Math.PI*2); ctx.stroke()
    } else if(a.chiForm === 'Ribbon'){
      ctx.strokeStyle = 'rgba(125,211,252,0.08)'
      ctx.beginPath(); ctx.moveTo(centerX,centerY); ctx.quadraticCurveTo((centerX+cx)/2, (centerY+cy)/2 - 20, cx, cy); ctx.stroke()
    } else if(a.chiForm === 'Mist'){
      ctx.fillStyle = 'rgba(125,211,252,0.06)'
      ctx.beginPath(); ctx.arc(cx,cy,6 + Math.sin(time/700 + i)*2,0,Math.PI*2); ctx.fill()
    } else if(a.chiForm === 'Pulse Rings'){
      ctx.strokeStyle = 'rgba(253,230,138,0.06)'
      const r2 = radius * (1 + Math.sin(time/400 + i) * 0.15)
      ctx.beginPath(); ctx.arc(centerX,centerY,r2,0,Math.PI*2); ctx.stroke()
    }
  }

  ctx.restore()
}
