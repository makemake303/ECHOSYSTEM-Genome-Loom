import { Genome } from '../types/genome'

export function drawOrganism(ctx: CanvasRenderingContext2D, width:number, height:number, genome: Genome){
  ctx.clearRect(0,0,width,height)
  // simple animated organism placeholder
  ctx.fillStyle = '#052128'
  ctx.fillRect(0,0,width,height)

  const cx = width/2
  const cy = height/2

  // body based on genome.body
  ctx.fillStyle = '#7dd3fc'
  if(genome.body==='Seed'){
    ctx.beginPath(); ctx.ellipse(cx,cy,40,50,0,0,Math.PI*2); ctx.fill()
  } else if(genome.body==='Orb'){
    ctx.beginPath(); ctx.arc(cx,cy,44,0,Math.PI*2); ctx.fill()
  } else if(genome.body==='Square'){
    ctx.fillRect(cx-38,cy-38,76,76)
  } else {
    ctx.beginPath(); ctx.moveTo(cx,cy-46); ctx.lineTo(cx+42,cy+36); ctx.lineTo(cx-42,cy+36); ctx.closePath(); ctx.fill()
  }

  // simple eyes render
  ctx.fillStyle = '#071827'
  const eyeCount = genome.eye==='Three' ? 3 : 2
  for(let i=0;i<eyeCount;i++){
    const ex = cx + (i-(eyeCount-1)/2)*22
    const ey = cy-8
    ctx.beginPath(); ctx.arc(ex,ey,8,0,Math.PI*2); ctx.fill()
  }
}
