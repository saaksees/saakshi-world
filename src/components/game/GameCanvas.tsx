import { useEffect, useRef, useState } from 'react'
import { useKeyboardControls } from '../../hooks/useKeyboardControls'
import { useCollision } from '../../hooks/useCollision'
import { drawPlayer } from './PlayerSprite'

const GRAVITY = 0.5
const JUMP_FORCE = -12
const MOVE_SPEED = 5
const PLAYER_WIDTH = 32
const PLAYER_HEIGHT = 48
const GROUND_HEIGHT = 80

function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const keys = useKeyboardControls()
  const { checkPlatformCollision, constrainToCanvas } = useCollision()
  
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const playerState = useRef({
    x: 100,
    y: 100,
    velocityX: 0,
    velocityY: 0,
    isGrounded: false,
    facingRight: true,
    animationFrame: 0,
    animationTick: 0,
  })

  const startPosition = useRef({ x: 100, y: dimensions.height - GROUND_HEIGHT - PLAYER_HEIGHT })

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement
        if (parent) {
          setDimensions({
            width: parent.clientWidth,
            height: parent.clientHeight,
          })
        }
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Update start position when dimensions change
  useEffect(() => {
    startPosition.current = { 
      x: 100, 
      y: dimensions.height - GROUND_HEIGHT - PLAYER_HEIGHT 
    }
  }, [dimensions])

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const gameLoop = () => {
      const player = playerState.current
      const groundY = dimensions.height - GROUND_HEIGHT

      // Handle reset
      if (keys.reset) {
        player.x = startPosition.current.x
        player.y = startPosition.current.y
        player.velocityX = 0
        player.velocityY = 0
        player.isGrounded = false
      }

      // Horizontal movement
      player.velocityX = 0
      if (keys.left) {
        player.velocityX = -MOVE_SPEED
        player.facingRight = false
      }
      if (keys.right) {
        player.velocityX = MOVE_SPEED
        player.facingRight = true
      }

      // Jump
      if (keys.jump && player.isGrounded) {
        player.velocityY = JUMP_FORCE
        player.isGrounded = false
      }

      // Apply gravity
      if (!player.isGrounded) {
        player.velocityY += GRAVITY
      }

      // Update position
      player.x += player.velocityX
      player.y += player.velocityY

      // Ground collision
      const playerBox = {
        x: player.x,
        y: player.y,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
      }

      const platform = {
        x: 0,
        y: groundY,
        width: dimensions.width,
        height: GROUND_HEIGHT,
      }

      if (checkPlatformCollision(playerBox, platform, player.velocityY)) {
        player.y = groundY - PLAYER_HEIGHT
        player.velocityY = 0
        player.isGrounded = true
      } else if (player.y + PLAYER_HEIGHT >= groundY) {
        // Snap to ground if somehow below
        player.y = groundY - PLAYER_HEIGHT
        player.velocityY = 0
        player.isGrounded = true
      } else {
        player.isGrounded = false
      }

      // Constrain to canvas bounds
      const constrained = constrainToCanvas(
        player.x,
        player.y,
        PLAYER_WIDTH,
        PLAYER_HEIGHT,
        dimensions.width,
        dimensions.height - GROUND_HEIGHT
      )
      player.x = constrained.x
      player.y = constrained.y

      // Animation frame for walk cycle (only if not reduced motion)
      if (!prefersReducedMotion) {
        if (player.velocityX !== 0) {
          player.animationTick++
          if (player.animationTick >= 8) {
            player.animationFrame++
            player.animationTick = 0
          }
        } else {
          player.animationFrame = 0
          player.animationTick = 0
        }
      }

      // Render
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Sky background gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, dimensions.height)
      skyGradient.addColorStop(0, '#1B1330') // navy-panel
      skyGradient.addColorStop(1, '#0F0A1E') // navy-deep
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      // Ground platform
      ctx.fillStyle = '#1B1330' // navy-panel
      ctx.fillRect(0, groundY, dimensions.width, GROUND_HEIGHT)
      
      // Ground platform top edge
      ctx.strokeStyle = '#B6A6E8' // lavender
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      ctx.lineTo(dimensions.width, groundY)
      ctx.stroke()

      // Ground details (simple grid pattern)
      ctx.strokeStyle = '#0F0A1E' // navy-deep
      ctx.lineWidth = 1
      for (let x = 0; x < dimensions.width; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, groundY)
        ctx.lineTo(x, dimensions.height)
        ctx.stroke()
      }

      // Draw player
      drawPlayer({
        ctx,
        x: player.x,
        y: player.y,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        isMoving: player.velocityX !== 0 && player.isGrounded,
        facingRight: player.facingRight,
        isJumping: !player.isGrounded,
        animationFrame: player.animationFrame,
      })

      // Debug info (small, unobtrusive)
      ctx.fillStyle = '#4FD6FF' // electric-blue
      ctx.font = '10px "JetBrains Mono", monospace'
      ctx.fillText(`Controls: ←→/AD move, ↑/W/Space jump, R reset`, 10, 20)
      ctx.fillText(`Pos: (${Math.round(player.x)}, ${Math.round(player.y)})`, 10, 35)
      ctx.fillText(`Grounded: ${player.isGrounded}`, 10, 50)

      animationFrameId = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [keys, dimensions, checkPlatformCollision, constrainToCanvas, prefersReducedMotion])

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="block"
    />
  )
}

export default GameCanvas
