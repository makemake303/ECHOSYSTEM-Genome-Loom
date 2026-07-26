import React from 'react'
import { useGenome } from '../state/useGenome'

export default function Toolbar(){
  const { undo, clear, selectedGene, setSelectedGene, translationFidelity, setTranslationFidelity, bodyInfluence, setBodyInfluence } = useGenome()

  return (
    <div style={{display:'flex', gap:8}}>
      <div style={{flex:1}}>
        <div className="toolbar-row">
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
            <input type="range" min={0} max={100} value={translationFidelity} onChange={e=>setTranslationFidelity(Number(e.target.value))} />
          </div>
        </div>
      </div>
      <div style={{width:200}}>
        <div className="label">Body Influence</div>
        <input type="range" min={0} max={100} value={bodyInfluence} onChange={e=>setBodyInfluence(Number(e.target.value))} />
      </div>
    </div>
  )
}
