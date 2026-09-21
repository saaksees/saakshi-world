interface PlayerSpriteProps {
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  width: number
  height: number
  isMoving: boolean
  facingRight: boolean
  isJumping: boolean
  animationFrame: number
}

export function drawPlayer({
  ctx,
  x,
  y,
  width,
  height,
  isMoving,
  facingRight,
  isJumping,
  animationFrame,
}: PlayerSpriteProps) {
  // Colors from design system
  const colors = {
    body: '#F7A8C4', // pink-soft
    satchel: '#B6A6E8', // lavender
    accent: '#FFC94D', // pixel-gold
    outline: '#0F0A1E', // navy-deep
  }

  ctx.save()

  // Flip horizontally if facing left
  if (!facingRight) {
    ctx.translate(x + width, y)
    ctx.scale(-1, 1)
    ctx.translate(-x, -y)
  }

  // Simple explorer character with satchel
  const headSize = width * 0.4
  const bodyWidth = width * 0.5
  const bodyHeight = height * 0.4
  const legWidth = width * 0.2
  const legHeight = height * 0.3

  const centerX = x + width / 2
  const headY = y + headSize / 2 + 2

  // Head
  ctx.fillStyle = colors.body
  ctx.fillRect(centerX - headSize / 2, headY - headSize / 2, headSize, headSize)
  ctx.strokeStyle = colors.outline
  ctx.lineWidth = 2
  ctx.strokeRect(centerX - headSize / 2, headY - headSize / 2, headSize, headSize)

  // Body
  const bodyY = headY + headSize / 2
  ctx.fillStyle = colors.body
  ctx.fillRect(centerX - bodyWidth / 2, bodyY, bodyWidth, bodyHeight)
  ctx.strokeRect(centerX - bodyWidth / 2, bodyY, bodyWidth, bodyHeight)

  // Satchel on back (small rectangle on shoulder)
  ctx.fillStyle = colors.satchel
  const satchelX = centerX + bodyWidth / 4
  const satchelY = bodyY + 2
  const satchelSize = width * 0.25
  ctx.fillRect(satchelX - satchelSize / 2, satchelY, satchelSize, satchelSize)
  ctx.strokeRect(satchelX - satchelSize / 2, satchelY, satchelSize, satchelSize)

  // Accent on satchel (notebook/clasp)
  ctx.fillStyle = colors.accent
  const accentSize = 4
  ctx.fillRect(
    satchelX - accentSize / 2,
    satchelY + satchelSize / 2 - accentSize / 2,
    accentSize,
    accentSize
  )

  // Legs - animated walk cycle when moving
  const legsY = bodyY + bodyHeight
  
  if (isJumping) {
    // Both legs together when jumping
    ctx.fillStyle = colors.body
    ctx.fillRect(centerX - bodyWidth / 2 + 4, legsY, legWidth, legHeight)
    ctx.strokeRect(centerX - bodyWidth / 2 + 4, legsY, legWidth, legHeight)
    ctx.fillRect(centerX + bodyWidth / 2 - legWidth - 4, legsY, legWidth, legHeight)
    ctx.strokeRect(centerX + bodyWidth / 2 - legWidth - 4, legsY, legWidth, legHeight)
  } else if (isMoving) {
    // Walking animation - alternate leg positions
    const offset = animationFrame % 2 === 0 ? 3 : -3
    
    // Left leg
    ctx.fillStyle = colors.body
    ctx.fillRect(centerX - bodyWidth / 2 + 4, legsY + offset, legWidth, legHeight - Math.abs(offset))
    ctx.strokeRect(centerX - bodyWidth / 2 + 4, legsY + offset, legWidth, legHeight - Math.abs(offset))
    
    // Right leg
    ctx.fillRect(centerX + bodyWidth / 2 - legWidth - 4, legsY - offset, legWidth, legHeight - Math.abs(offset))
    ctx.strokeRect(centerX + bodyWidth / 2 - legWidth - 4, legsY - offset, legWidth, legHeight - Math.abs(offset))
  } else {
    // Idle - legs straight
    ctx.fillStyle = colors.body
    ctx.fillRect(centerX - bodyWidth / 2 + 4, legsY, legWidth, legHeight)
    ctx.strokeRect(centerX - bodyWidth / 2 + 4, legsY, legWidth, legHeight)
    ctx.fillRect(centerX + bodyWidth / 2 - legWidth - 4, legsY, legWidth, legHeight)
    ctx.strokeRect(centerX + bodyWidth / 2 - legWidth - 4, legsY, legWidth, legHeight)
  }

  ctx.restore()
}
