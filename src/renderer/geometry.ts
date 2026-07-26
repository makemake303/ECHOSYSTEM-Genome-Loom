export const CANVAS_SIZE = 680
export const STEP_COUNT = 16
export const RING_RADII = [54, 94, 136, 180, 226, 276]

export function socketPosition(
  ring: number,
  step: number,
  centerX = CANVAS_SIZE / 2,
  centerY = CANVAS_SIZE / 2,
) {
  const angle = step * Math.PI / 8 - Math.PI / 2

  return {
    x: centerX + Math.cos(angle) * RING_RADII[ring],
    y: centerY + Math.sin(angle) * RING_RADII[ring],
  }
}
