import React from 'react'
import { useGenome } from '../state/useGenome'

export default function AnatomyPanel(){
  const { body, setBody, eye, setEye, chi, setChi } = useGenome()

  return (
    <div>
      <h3>Anatomy</h3>
      <div className="panel-section">
        <div className="label">Body</div>
        <select value={body} onChange={(e)=>setBody(e.target.value as any)}>
          <option value="Seed">Seed</option>
          <option value="Orb">Orb</option>
          <option value="Square">Square</option>
          <option value="Triangle">Triangle</option>
        </select>

        <div className="label">Eye</div>
        <select value={eye} onChange={(e)=>setEye(e.target.value as any)}>
          <option value="Bright">Bright</option>
          <option value="Curious">Curious</option>
          <option value="Tiny">Tiny</option>
          <option value="Single">Single</option>
          <option value="Three">Three</option>
        </select>

        <div className="label">Chi (density)</div>
        <input type="range" min={0} max={10} value={chi} onChange={(e)=>setChi(Number(e.target.value))} />
      </div>
    </div>
  )
}
