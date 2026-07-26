export type Gene = {
  type: 'bead' | 'triangle' | 'ring' | 'stitch' | string
  // future properties like color, size, params
}

export type Socket = {
  gene: Gene | null
}

export type Ring = {
  sockets: Socket[]
}

export type BodyType = 'Seed' | 'Orb' | 'Square' | 'Triangle'
export type EyeType = 'Bright' | 'Curious' | 'Tiny' | 'Single' | 'Three'

export type Genome = {
  body: BodyType
  eye?: EyeType
  rings: Ring[]
}
