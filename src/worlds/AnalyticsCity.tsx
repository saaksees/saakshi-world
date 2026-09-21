import { useEffect, useRef, useState } from 'react'
import { useKeyboardControls } from '../hooks/useKeyboardControls'
import { useCollision } from '../hooks/useCollision'
import { drawPlayer } from '../components/game/PlayerSprite'
import InteractionModal from '../components/game/InteractionModal'
import DashboardPreview from '../components/game/DashboardPreview'
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
  type: 'tower1' | 'tower2' | 'hq'
  skillId: string
}

function AnalyticsCity() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const keys = useKeyboardControls()
  const { checkPlatformCollision, constrainToCanvas } = useCollision()
  
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [showListView, setShowListView] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null)
  const [nearbyObject, setNearbyObject] = useState<InteractiveObject | null>(null)
  
  const skills = getSkillsByWorld('analytics-city')
  
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

  // Interactive structures positioned along the platform
  const objects = useRef<InteractiveObject[]>([
    {
      id: 'powerbi-tower',
      x: 180,
      y: dimensions.height - GROUND_HEIGHT - 100,
      width: 60,
      height: 100,
      type: 'tower1',
      skillId: 'powerbi',
    },
    {
      id: 'tableau-tower',
      x: 380,
      y: dimensions.height - GROUND_HEIGHT - 110,
      width: 55,
      height: 110,
      type: 'tower2',
      skillId: 'tableau',
    },
    {
      id: 'insights-hq',
      x: 580,
      y: dimensions.height - GROUND_HEIGHT - 90,
      width: 70,
      height: 90,
      type: 'hq',
      skillId: 'business-insights',
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
    objects.current[0].y = dimensions.height - GROUND_HEIGHT - 100
    objects.current[1].y = dimensions.height - GROUND_HEIGHT - 110
    objects.current[2].y = dimensions.height - GROUND_HEIGHT - 90
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
    if (showListView) return

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
        if (distance < 70 && player.isGrounded) {
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

      // Render
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Dusk sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, dimensions.height * 0.6)
      skyGradient.addColorStop(0, '#2a1a3f') // Deep purple
      skyGradient.addColorStop(0.5, '#1B1330') // navy-panel
      skyGradient.addColorStop(1, '#0F0A1E') // navy-deep
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      // Background buildings (parallax layer - static silhouettes)
      drawBackgroundBuildings(ctx, dimensions.width, groundY)

      // Ground platform (city street)
      ctx.fillStyle = '#1B1330' // navy-panel
      ctx.fillRect(0, groundY, dimensions.width, GROUND_HEIGHT)
      
      // Street edge
      ctx.strokeStyle = '#B6A6E8' // lavender
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      ctx.lineTo(dimensions.width, groundY)
      ctx.stroke()

      // Street grid lines
      ctx.strokeStyle = '#0F0A1E' // navy-deep
      ctx.lineWidth = 1
      for (let x = 0; x < dimensions.width; x += 60) {
        ctx.beginPath()
        ctx.moveTo(x, groundY + 10)
        ctx.lineTo(x, dimensions.height)
        ctx.stroke()
      }

      // Draw interactive structures
      objects.current.forEach(obj => {
        drawBuilding(ctx, obj)
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
        ctx.fillStyle = 'rgba(15, 10, 30, 0.9)'
        ctx.fillRect(player.x - 10, player.y - 30, PLAYER_WIDTH + 20, 20)
        ctx.strokeStyle = '#B6A6E8'
        ctx.lineWidth = 2
        ctx.strokeRect(player.x - 10, player.y - 30, PLAYER_WIDTH + 20, 20)
        
        ctx.fillStyle = '#F5EEE0'
        ctx.font = '10px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.fillText('[E] Interact', player.x + PLAYER_WIDTH / 2, player.y - 16)
        ctx.textAlign = 'left'
      }

      // UI Instructions
      ctx.fillStyle = '#4FD6FF'
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
        worldName="Analytics City"
        skills={skills}
        onBack={() => setShowListView(false)}
      />
    )
  }

  // Determine if we should show dashboard preview
  const dashboardPreview = selectedSkill?.id === 'powerbi' ? <DashboardPreview /> : undefined

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
        <h1 className="font-pixel text-xl text-cream mb-2">Analytics City</h1>
        <p className="text-lavender text-sm mb-2">
          Explore business intelligence towers and interact to learn more
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
        dashboardPreview={dashboardPreview}
      />
    </div>
  )
}

function drawBackgroundBuildings(ctx: CanvasRenderingContext2D, canvasWidth: number, groundY: number) {
  // Background layer - distant silhouettes
  ctx.save()
  ctx.globalAlpha = 0.3

  // Building 1
  ctx.fillStyle = '#1B1330'
  ctx.fillRect(50, groundY - 120, 80, 120)
  // Windows
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      if (Math.random() > 0.3) {
        ctx.fillStyle = '#FFC94D'
        ctx.fillRect(60 + col * 15, groundY - 110 + row * 18, 8, 12)
      }
    }
  }

  // Building 2
  ctx.fillStyle = '#1B1330'
  ctx.fillRect(200, groundY - 90, 60, 90)
  // Windows
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      if (Math.random() > 0.3) {
        ctx.fillStyle = '#FFC94D'
        ctx.fillRect(210 + col * 15, groundY - 80 + row * 18, 8, 12)
      }
    }
  }

  // Building 3
  ctx.fillStyle = '#1B1330'
  ctx.fillRect(canvasWidth - 150, groundY - 140, 90, 140)
  // Windows
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 4; col++) {
      if (Math.random() > 0.3) {
        ctx.fillStyle = '#FFC94D'
        ctx.fillRect(canvasWidth - 140 + col * 18, groundY - 130 + row * 18, 10, 12)
      }
    }
  }

  ctx.restore()
}

function drawBuilding(ctx: CanvasRenderingContext2D, obj: InteractiveObject) {
  ctx.save()

  const colors = {
    tower1: { primary: '#4FD6FF', secondary: '#0F0A1E', accent: '#B6A6E8' }, // Power BI - electric-blue
    tower2: { primary: '#B6A6E8', secondary: '#0F0A1E', accent: '#4FD6FF' }, // Tableau - lavender
    hq: { primary: '#FFC94D', secondary: '#0F0A1E', accent: '#FF3E8E' }, // HQ - pixel-gold
  }

  const color = colors[obj.type]

  // Building body
  ctx.fillStyle = color.secondary
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
  ctx.strokeStyle = color.primary
  ctx.lineWidth = 3
  ctx.strokeRect(obj.x, obj.y, obj.width, obj.height)

  // Windows (lit up)
  const windowRows = Math.floor(obj.height / 20)
  const windowCols = Math.floor(obj.width / 20)
  
  for (let row = 0; row < windowRows; row++) {
    for (let col = 0; col < windowCols; col++) {
      if ((row + col) % 2 === 0) {
        ctx.fillStyle = color.primary
        ctx.fillRect(
          obj.x + 8 + col * 20,
          obj.y + 8 + row * 20,
          12,
          14
        )
      }
    }
  }

  // Antenna/roof detail
  if (obj.type === 'tower1' || obj.type === 'tower2') {
    ctx.strokeStyle = color.accent
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(obj.x + obj.width / 2, obj.y)
    ctx.lineTo(obj.x + obj.width / 2, obj.y - 10)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.arc(obj.x + obj.width / 2, obj.y - 13, 3, 0, Math.PI * 2)
    ctx.fill()
  }

  // HQ sign
  if (obj.type === 'hq') {
    ctx.fillStyle = color.accent
    ctx.fillRect(obj.x + 10, obj.y + 10, obj.width - 20, 15)
    ctx.fillStyle = color.secondary
    ctx.font = '10px "Press Start 2P"'
    ctx.textAlign = 'center'
    ctx.fillText('HQ', obj.x + obj.width / 2, obj.y + 22)
    ctx.textAlign = 'left'
  }

  ctx.restore()
}

export default AnalyticsCity
