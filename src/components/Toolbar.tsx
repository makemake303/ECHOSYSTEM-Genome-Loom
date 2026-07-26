import React from 'react'
import { useGenome } from '../state/useGenome'

export default function Toolbar(){
  const { undo, clear, selectedGene, setSelectedGene, genome, updateAnatomy, dreamGenome } = useGenome()

  return (
    <div style={{display:'flex', gap:8, alignItems:'center'}}>
      <div style={{flex:1}}>
        <div className="toolbar-row">
          <button onClick={dreamGenome}>Dream Genome</button>
          <button onClick={undo}>Undo</button>
          <button onClick={clear}>Clear</button>
        </div>
        <div className="toolbar-row" style={{marginTop:8}}>
          <select value={selectedGene} onChange={e=>setSelectedGene(e.target.value)}>
            <option value="bead">Bead</option>
            <option value="triangle">Triangle</option>
            <option value="ring">Ring</option>
            <option value="stitch">Stitch</option>
          </select>
          <div style={{display:'flex', alignItems:'center', gap:6}}>
            <label className="label" style={{margin:0}}>Translation Fidelity</label>
            <input type="range" min={0} max={100} value={genome.anatomy.translationFidelity} onChange={e=>updateAnatomy({translationFidelity: Number(e.target.value)})} />
          </div>
        </div>
      </div>
      <div style={{width:200}}>
        <div className="label">Body Influence</div>
        <input type="range" min={0} max={100} value={genome.anatomy.bodyInfluence} onChange={e=>updateAnatomy({bodyInfluence: Number(e.target.value)})} />
      </div>
    </div>
  )
}
