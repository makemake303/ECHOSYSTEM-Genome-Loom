import { Genome, Gene, Socket } from '../types/genome'

export function drawGenome(ctx: CanvasRenderingContext2D, width: number, height: number, genome: Genome, opts: {selectedGene?: string | null}){
  ctx.clearRect(0,0,width,height)
  const cx = width/2
  const cy = height/2
  const rings = genome.rings
  const ringCount = rings.length
  const baseR = Math.min(width,height) * 0.08

  // background
  ctx.fillStyle = '#071827'
  ctx.fillRect(0,0,width,height)

  // draw rings and sockets
  rings.forEach((ring, i)=>{
    const r = baseR + i * (baseR*0.9)
    // ring circle
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.beginPath()
    ctx.arc(cx,cy,r,0,Math.PI*2)
    ctx.stroke()

    const sockets = ring.sockets
    const n = sockets.length
    sockets.forEach((s, j)=>{
      const angle = (j / n) * Math.PI * 2 - Math.PI/2
      const sx = cx + Math.cos(angle) * r
      const sy = cy + Math.sin(angle) * r
      // draw socket
      ctx.fillStyle = 'rgba(255,255,255,0.03)'
      ctx.beginPath()
      ctx.arc(sx,sy,8,0,Math.PI*2)
      ctx.fill()

      // draw gene if present
      if(s.gene){
        drawGeneAt(ctx, sx, sy, s.gene.type)
      }
    })
  })
}

function drawGeneAt(ctx: CanvasRenderingContext2D, x:number, y:number, type: string){
  ctx.save()
  ctx.translate(x,y)
  if(type==='bead'){
    ctx.fillStyle = '#7dd3fc'
    ctx.beginPath(); ctx.arc(0,0,6,0,Math.PI*2); ctx.fill()
  } else if(type==='triangle'){
    ctx.fillStyle = '#fda4af'
    ctx.beginPath(); ctx.moveTo(0,-8); ctx.lineTo(7,6); ctx.lineTo(-7,6); ctx.closePath(); ctx.fill()
  } else if(type==='ring'){
    ctx.strokeStyle = '#fde68a'
    ctx.beginPath(); ctx.arc(0,0,8,0,Math.PI*2); ctx.stroke()
  } else if(type==='stitch'){
    ctx.strokeStyle = '#bbf7d0'
    ctx.beginPath(); ctx.moveTo(-6,0); ctx.lineTo(6,0); ctx.stroke()
  }
  ctx.restore()
}
