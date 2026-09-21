interface CollisionBox {
  x: number
  y: number
  width: number
  height: number
}

interface Platform {
  x: number
  y: number
  width: number
  height: number
}

export function useCollision() {
  // AABB (Axis-Aligned Bounding Box) collision detection
  const checkAABB = (box1: CollisionBox, box2: CollisionBox): boolean => {
    return (
      box1.x < box2.x + box2.width &&
      box1.x + box1.width > box2.x &&
      box1.y < box2.y + box2.height &&
      box1.y + box1.height > box2.y
    )
  }

  // Check if player is on a platform (standing on top)
  const checkPlatformCollision = (
    player: CollisionBox,
    platform: Platform,
    velocityY: number
  ): boolean => {
    // Only check if player is falling (velocityY > 0)
    if (velocityY <= 0) return false

    const playerBottom = player.y + player.height
    const platformTop = platform.y

    // Check if player's feet are near or past the platform top
    const isAbovePlatform = playerBottom >= platformTop && playerBottom <= platformTop + 10

    // Check horizontal overlap
    const hasHorizontalOverlap =
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width

    return isAbovePlatform && hasHorizontalOverlap
  }

  // Constrain player within canvas bounds
  const constrainToCanvas = (
    x: number,
    y: number,
    width: number,
    height: number,
    canvasWidth: number,
    canvasHeight: number
  ): { x: number; y: number } => {
    const constrainedX = Math.max(0, Math.min(x, canvasWidth - width))
    const constrainedY = Math.max(0, Math.min(y, canvasHeight - height))
    return { x: constrainedX, y: constrainedY }
  }

  return {
    checkAABB,
    checkPlatformCollision,
    constrainToCanvas,
  }
}
