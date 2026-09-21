import { useEffect, useRef, useState } from 'react'
import { useKeyboardControls } from '../hooks/useKeyboardControls'
import { useCollision } from '../hooks/useCollision'
import { drawPlayer } from '../components/game/PlayerSprite'
import InteractionModal from '../components/game/InteractionModal'
import WorldListView from '../components/ui/WorldListView'
import { getSkillsByWorld, SkillNode } from '../data/skills'

const GRAVITY = 0.5
const JUMP_FORCE = -12
const MOVE_SPEED = 5
const PLAYER_WIDTH = 32
const PLAYER_HEIGHT = 48
const GROUND_HEIGHT = 80

interface InteractiveObject {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: 'terminal' | 'database' | 'notebook'
  skillId: string
}

function DataValley() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const keys = useKeyboardControls()
  const { checkPlatformCollision, constrainToCanvas } = useCollision()
  
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [showListView, setShowListView] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null)
  const [nearbyObject, setNearbyObject] = useState<InteractiveObject | null>(null)
  
  const skills = getSkillsByWorld('data-valley')
  const dataStreamOffset = useRef(0)
  
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

  // Interactive objects positioned along the platform
  const objects = useRef<InteractiveObject[]>([
    {
      id: 'python-terminal',
      x: 200,
      y: dimensions.height - GROUND_HEIGHT - 60,
      width: 50,
      height: 60,
      type: 'terminal',
      skillId: 'python',
    },
    {
      id: 'sql-database',
      x: 400,
      y: dimensions.height - GROUND_HEIGHT - 70,
      width: 40,
      height: 70,
      type: 'database',
      skillId: 'sql',
    },
    {
      id: 'stats-notebook',
      x: 600,
      y: dimensions.height - GROUND_HEIGHT - 50,
      width: 45,
      height: 50,
      type: 'notebook',
      skillId: 'statistics',
    },
  ])

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

  // Update positions when dimensions change
  useEffect(() => {
    startPosition.current = { 
      x: 100, 
      y: dimensions.height - GROUND_HEIGHT - PLAYER_HEIGHT 
    }
    
    // Update object Y positions
    objects.current[0].y = dimensions.height - GROUND_HEIGHT - 60
    objects.current[1].y = dimensions.height - GROUND_HEIGHT - 70
    objects.current[2].y = dimensions.height - GROUND_HEIGHT - 50
  }, [dimensions])

  // Handle interaction key press
  useEffect(() => {
    if (keys.interact && nearbyObject) {
      const skill = skills.find(s => s.id === nearbyObject.skillId)
      if (skill) {
        setSelectedSkill(skill)
      }
    }
  }, [keys.interact, nearbyObject, skills])

  // Game loop
  useEffect(() => {
    if (showListView) return // Don't run game loop in list view

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

      // Check proximity to interactive objects
      let foundNearby: InteractiveObject | null = null
      for (const obj of objects.current) {
        const distance = Math.abs(player.x + PLAYER_WIDTH / 2 - (obj.x + obj.width / 2))
        if (distance < 60 && player.isGrounded) {
          foundNearby = obj
          break
        }
      }
      setNearbyObject(foundNearby)

      // Animation frame for walk cycle
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

      // Update data stream animation
      if (!prefersReducedMotion) {
        dataStreamOffset.current = (dataStreamOffset.current + 1) % 40
      }

      // Render
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Sky background gradient (pastel tones)
      const skyGradient = ctx.createLinearGradient(0, 0, 0, dimensions.height)
      skyGradient.addColorStop(0, '#1B1330') // navy-panel
      skyGradient.addColorStop(0.6, '#0F0A1E') // navy-deep
      skyGradient.addColorStop(1, '#1a2820') // greenish dark
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      // Ground platform (pastel green tint)
      const groundGradient = ctx.createLinearGradient(0, groundY, 0, dimensions.height)
      groundGradient.addColorStop(0, '#1B1330') // navy-panel
      groundGradient.addColorStop(1, '#1a2820') // greenish
      ctx.fillStyle = groundGradient
      ctx.fillRect(0, groundY, dimensions.width, GROUND_HEIGHT)
      
      // Ground platform top edge
      ctx.strokeStyle = '#B6A6E8' // lavender
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      ctx.lineTo(dimensions.width, groundY)
      ctx.stroke()

      // Data stream (decorative moving dots)
      const streamY = groundY + 20
      const streamStartX = 150
      const streamEndX = 650
      ctx.fillStyle = '#4FD6FF' // electric-blue
      for (let x = streamStartX; x < streamEndX; x += 40) {
        const dotX = x + (prefersReducedMotion ? 0 : dataStreamOffset.current)
        if (dotX >= streamStartX && dotX <= streamEndX) {
          ctx.beginPath()
          ctx.arc(dotX, streamY, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Draw interactive objects
      objects.current.forEach(obj => {
        drawInteractiveObject(ctx, obj)
      })

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

      // Draw interaction prompt if near object
      if (nearbyObject) {
        ctx.fillStyle = 'rgba(15, 10, 30, 0.9)' // navy-deep with opacity
        ctx.fillRect(player.x - 10, player.y - 30, PLAYER_WIDTH + 20, 20)
        ctx.strokeStyle = '#B6A6E8' // lavender
        ctx.lineWidth = 2
        ctx.strokeRect(player.x - 10, player.y - 30, PLAYER_WIDTH + 20, 20)
        
        ctx.fillStyle = '#F5EEE0' // cream
        ctx.font = '10px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.fillText('[E] Interact', player.x + PLAYER_WIDTH / 2, player.y - 16)
        ctx.textAlign = 'left'
      }

      // UI Instructions
      ctx.fillStyle = '#4FD6FF' // electric-blue
      ctx.font = '10px "JetBrains Mono", monospace'
      ctx.fillText(`←→/AD move  ↑/W/Space jump  E interact  R reset`, 10, 20)

      animationFrameId = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [keys, dimensions, checkPlatformCollision, constrainToCanvas, prefersReducedMotion, nearbyObject, showListView])

  if (showListView) {
    return (
      <WorldListView
        worldName="Data Valley"
        skills={skills}
        onBack={() => setShowListView(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-navy-deep flex flex-col">
      {/* Toggle View Button */}
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => setShowListView(true)}
          className="px-4 py-2 font-sans text-sm font-medium
                     bg-transparent text-lavender border-2 border-lavender 
                     hover:bg-lavender hover:bg-opacity-10 
                     focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-electric-blue 
                     transition-all"
        >
          View as list
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl h-[600px] border-4 border-lavender shadow-[8px_8px_0px_0px_rgba(182,166,232,0.3)]">
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="block"
          />
        </div>
      </div>

      <div className="p-4 text-center">
        <h1 className="font-pixel text-xl text-cream mb-2">Data Valley</h1>
        <p className="text-lavender text-sm mb-2">
          Walk to interactive objects and press E to learn more
        </p>
        <p className="text-cream font-sans text-xs">
          <kbd className="font-mono text-xs bg-navy-panel px-2 py-1 border border-lavender">←→</kbd>
          {' '}or{' '}
          <kbd className="font-mono text-xs bg-navy-panel px-2 py-1 border border-lavender">A D</kbd>
          {' '}move •{' '}
          <kbd className="font-mono text-xs bg-navy-panel px-2 py-1 border border-lavender">E</kbd>
          {' '}interact
        </p>
      </div>

      <InteractionModal
        isOpen={selectedSkill !== null}
        onClose={() => setSelectedSkill(null)}
        skill={selectedSkill}
      />
    </div>
  )
}

function drawInteractiveObject(ctx: CanvasRenderingContext2D, obj: InteractiveObject) {
  ctx.save()

  const colors = {
    terminal: { primary: '#4FD6FF', secondary: '#0F0A1E', accent: '#B6A6E8' }, // electric-blue
    database: { primary: '#B6A6E8', secondary: '#0F0A1E', accent: '#4FD6FF' }, // lavender
    notebook: { primary: '#FFC94D', secondary: '#0F0A1E', accent: '#F7A8C4' }, // pixel-gold
  }

  const color = colors[obj.type]

  switch (obj.type) {
    case 'terminal':
      // Monitor screen
      ctx.fillStyle = color.secondary
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height * 0.7)
      ctx.strokeStyle = color.primary
      ctx.lineWidth = 3
      ctx.strokeRect(obj.x, obj.y, obj.width, obj.height * 0.7)
      
      // Screen glow
      ctx.fillStyle = color.primary
      ctx.fillRect(obj.x + 5, obj.y + 5, obj.width - 10, obj.height * 0.7 - 10)
      
      // Stand
      ctx.fillStyle = color.secondary
      ctx.fillRect(obj.x + obj.width / 2 - 5, obj.y + obj.height * 0.7, 10, obj.height * 0.3)
      ctx.strokeStyle = color.primary
      ctx.strokeRect(obj.x + obj.width / 2 - 5, obj.y + obj.height * 0.7, 10, obj.height * 0.3)
      break

    case 'database':
      // Cylinder top
      ctx.fillStyle = color.primary
      ctx.beginPath()
      ctx.ellipse(obj.x + obj.width / 2, obj.y + 10, obj.width / 2, 10, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = color.secondary
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Cylinder body
      ctx.fillStyle = color.primary
      ctx.fillRect(obj.x, obj.y + 10, obj.width, obj.height - 20)
      ctx.strokeRect(obj.x, obj.y + 10, obj.width, obj.height - 20)
      
      // Cylinder bottom
      ctx.beginPath()
      ctx.ellipse(obj.x + obj.width / 2, obj.y + obj.height - 10, obj.width / 2, 10, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      
      // Detail lines
      ctx.strokeStyle = color.accent
      ctx.beginPath()
      ctx.moveTo(obj.x, obj.y + obj.height / 2)
      ctx.lineTo(obj.x + obj.width, obj.y + obj.height / 2)
      ctx.stroke()
      break

    case 'notebook':
      // Notebook cover
      ctx.fillStyle = color.primary
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
      ctx.strokeStyle = color.secondary
      ctx.lineWidth = 3
      ctx.strokeRect(obj.x, obj.y, obj.width, obj.height)
      
      // Spiral binding
      ctx.strokeStyle = color.accent
      ctx.lineWidth = 2
      for (let i = 0; i < 5; i++) {
        const spiralY = obj.y + 10 + i * 8
        ctx.beginPath()
        ctx.arc(obj.x + 5, spiralY, 3, 0, Math.PI * 2)
        ctx.stroke()
      }
      
      // Paper lines
      ctx.strokeStyle = color.secondary
      ctx.lineWidth = 1
      for (let i = 0; i < 4; i++) {
        const lineY = obj.y + 15 + i * 8
        ctx.beginPath()
        ctx.moveTo(obj.x + 12, lineY)
        ctx.lineTo(obj.x + obj.width - 5, lineY)
        ctx.stroke()
      }
      break
  }

  ctx.restore()
}

export default DataValley
