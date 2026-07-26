import React from 'react'
import { useGenome } from '../state/useGenome'

export default function AnatomyPanel(){
  const { genome, updateAnatomy } = useGenome()
  const anatomy = genome.anatomy

  return (
    <div>
      <h3>Anatomy</h3>
      <div className="panel-section">
        <div className="label">Body</div>
        <select value={anatomy.body} onChange={(e)=>updateAnatomy({body: e.target.value as any})}>
          <option value="Seed">Seed</option>
          <option value="Orb">Orb</option>
          <option value="Square">Square</option>
          <option value="Triangle">Triangle</option>
        </select>

        <div className="label">Eye</div>
        <select value={anatomy.eye} onChange={(e)=>updateAnatomy({eye: e.target.value as any})}>
          <option value="Bright">Bright</option>
          <option value="Curious">Curious</option>
          <option value="Tiny">Tiny</option>
          <option value="Single">Single</option>
          <option value="Three">Three</option>
        </select>

        <div className="label">Chi Form</div>
        <select value={anatomy.chiForm} onChange={(e)=>updateAnatomy({chiForm: e.target.value as any})}>
          <option value="Orbiting Beads">Orbiting Beads</option>
          <option value="Halo">Halo</option>
          <option value="Ribbon">Ribbon</option>
          <option value="Mist">Mist</option>
          <option value="Pulse Rings">Pulse Rings</option>
        </select>

        <div className="label">Chi Motion</div>
        <select value={anatomy.chiMotion} onChange={(e)=>updateAnatomy({chiMotion: e.target.value as any})}>
          <option value="Orbit">Orbit</option>
          <option value="Breathe">Breathe</option>
          <option value="Pulse">Pulse</option>
          <option value="Drift">Drift</option>
          <option value="Counter-rotate">Counter-rotate</option>
        </select>

        <div className="label">Chi Density ({anatomy.chiDensity})</div>
        <input type="range" min={4} max={22} value={anatomy.chiDensity} onChange={(e)=>updateAnatomy({chiDensity: Number(e.target.value)})} />

        <div className="label">BPM ({anatomy.bpm})</div>
        <input type="range" min={40} max={160} value={anatomy.bpm} onChange={(e)=>updateAnatomy({bpm: Number(e.target.value)})} />

      </div>
    </div>
  )
}
