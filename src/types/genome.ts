export type GeneType =
  | 'bead'
  | 'triangle'
  | 'ring'
  | 'stitch'

export type Gene = {
  type: GeneType
  weight: number
}

export type Socket = {
  gene: Gene | null
}

export type Ring = {
  sockets: Socket[]
}

export type BodyType = 'Seed' | 'Orb' | 'Square' | 'Triangle'
export type EyeType = 'Bright' | 'Curious' | 'Tiny' | 'Single' | 'Three'

export type ChiForm =
  | 'Orbiting Beads'
  | 'Halo'
  | 'Ribbon'
  | 'Mist'
  | 'Pulse Rings'

export type ChiMotion = 'Orbit' | 'Breathe' | 'Pulse' | 'Drift' | 'Counter-rotate'

export type Anatomy = {
  body: BodyType
  eye: EyeType
  chiForm: ChiForm
  chiMotion: ChiMotion
  chiDensity: number
  translationFidelity: number
  bodyInfluence: number
  bpm: number
}

export type Genome = {
  rings: Ring[]
  anatomy: Anatomy
}
