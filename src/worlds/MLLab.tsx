import { useEffect, useRef, useState } from 'react'
import { useKeyboardControls } from '../hooks/useKeyboardControls'
import { useCollision } from '../hooks/useCollision'
import { drawPlayer } from '../components/game/PlayerSprite'
import InteractionModal from '../components/game/InteractionModal'
import RegressionDemo from '../components/game/RegressionDemo'
import ForecastDemo from '../components/game/ForecastDemo'
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
  type: 'regression' | 'classification' | 'forecasting' | 'xgboost'
  skillId: string
}

function MLLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const keys = useKeyboardControls()
  const { checkPlatformCollision, constrainToCanvas } = useCollision()
  
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [showListView, setShowListView] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null)
  const [nearbyObject, setNearbyObject] = useState<InteractiveObject | null>(null)
  
  const skills = getSkillsByWorld('ml-lab')
  
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

  // Interactive machines positioned along the platform
  const objects = useRef<InteractiveObject[]>([
    {
      id: 'regression-machine',
      x: 120,
      y: dimensions.height - GROUND_HEIGHT - 80,
      width: 50,
      height: 80,
      type: 'regression',
      skillId: 'regression',
    },
    {
      id: 'classification-machine',
      x: 260,
      y: dimensions.height - GROUND_HEIGHT - 85,
      width: 55,
      height: 85,
      type: 'classification',
      skillId: 'classification',
    },
    {
      id: 'forecasting-crystal',
      x: 420,
      y: dimensions.height - GROUND_HEIGHT - 75,
      width: 50,
      height: 75,
      type: 'forecasting',
      skillId: 'forecasting',
    },
    {
      id: 'xgboost-reactor',
      x: 580,
      y: dimensions.height - GROUND_HEIGHT - 90,
      width: 60,
      height: 90,
      type: 'xgboost',
      skillId: 'xgboost',
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
    objects.current[0].y = dimensions.height - GROUND_HEIGHT - 80
    objects.current[1].y = dimensions.height - GROUND_HEIGHT - 85
    objects.current[2].y = dimensions.height - GROUND_HEIGHT - 75
    objects.current[3].y = dimensions.height - GROUND_HEIGHT - 90
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
    const modalIsOpen = selectedSkill !== null

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
        if (distance < 65 && player.isGrounded) {
          foundNearby = obj
          break
        }
      }
      setNearbyObject(foundNearby)

      // Animation frame for walk cycle (skip if modal is open to save performance)
      if (!prefersReducedMotion && !modalIsOpen) {
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

      // Futuristic lab background - darker with electric-blue glow
      const bgGradient = ctx.createLinearGradient(0, 0, 0, dimensions.height)
      bgGradient.addColorStop(0, '#0a0614') // Very dark purple
      bgGradient.addColorStop(0.5, '#0F0A1E') // navy-deep
      bgGradient.addColorStop(1, '#0a0a14') // Dark blue-tint
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      // Ambient glow effects (only if modal is closed to save performance)
      if (!modalIsOpen) {
        ctx.save()
        ctx.globalAlpha = 0.1
        ctx.fillStyle = '#4FD6FF' // electric-blue
        objects.current.forEach(obj => {
          const gradient = ctx.createRadialGradient(
            obj.x + obj.width / 2,
            obj.y + obj.height / 2,
            0,
            obj.x + obj.width / 2,
            obj.y + obj.height / 2,
            80
          )
          gradient.addColorStop(0, '#4FD6FF')
          gradient.addColorStop(1, 'transparent')
          ctx.fillStyle = gradient
          ctx.fillRect(obj.x - 40, obj.y - 40, obj.width + 80, obj.height + 80)
        })
        ctx.restore()
      }

      // Lab floor
      ctx.fillStyle = '#0F0A1E' // navy-deep
      ctx.fillRect(0, groundY, dimensions.width, GROUND_HEIGHT)
      
      // Floor edge with glow
      ctx.strokeStyle = '#4FD6FF' // electric-blue
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      ctx.lineTo(dimensions.width, groundY)
      ctx.stroke()

      // Floor grid (technical look)
      ctx.strokeStyle = '#1B1330' // navy-panel
      ctx.lineWidth = 1
      for (let x = 0; x < dimensions.width; x += 50) {
        ctx.beginPath()
        ctx.moveTo(x, groundY)
        ctx.lineTo(x, dimensions.height)
        ctx.stroke()
      }

      // Draw interactive machines
      objects.current.forEach(obj => {
        drawMachine(ctx, obj, modalIsOpen)
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
        ctx.strokeStyle = '#4FD6FF' // electric-blue for lab theme
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
  }, [keys, dimensions, checkPlatformCollision, constrainToCanvas, prefersReducedMotion, nearbyObject, showListView, selectedSkill])

  if (showListView) {
    return (
      <WorldListView
        worldName="ML Lab"
        skills={skills}
        onBack={() => setShowListView(false)}
      />
    )
  }

  // Determine which demo to show
  let demoContent: React.ReactNode = undefined
  if (selectedSkill?.id === 'regression') {
    demoContent = <RegressionDemo />
  } else if (selectedSkill?.id === 'forecasting') {
    demoContent = <ForecastDemo />
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
        <div className="w-full max-w-5xl h-[600px] border-4 border-electric-blue shadow-[8px_8px_0px_0px_rgba(79,214,255,0.3)]">
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="block"
          />
        </div>
      </div>

      <div className="p-4 text-center">
        <h1 className="font-pixel text-xl text-cream mb-2">ML Lab</h1>
        <p className="text-electric-blue text-sm mb-2">
          Explore machine learning models with live visualizations
        </p>
        <p className="text-cream font-sans text-xs">
          <kbd className="font-mono text-xs bg-navy-panel px-2 py-1 border border-electric-blue">←→</kbd>
          {' '}or{' '}
          <kbd className="font-mono text-xs bg-navy-panel px-2 py-1 border border-electric-blue">A D</kbd>
          {' '}move •{' '}
          <kbd className="font-mono text-xs bg-navy-panel px-2 py-1 border border-electric-blue">E</kbd>
          {' '}interact
        </p>
      </div>

      <InteractionModal
        isOpen={selectedSkill !== null}
        onClose={() => setSelectedSkill(null)}
        skill={selectedSkill}
        dashboardPreview={demoContent}
      />
    </div>
  )
}

function drawMachine(ctx: CanvasRenderingContext2D, obj: InteractiveObject, _skipEffects: boolean) {
  ctx.save()

  const colors = {
    regression: { primary: '#4FD6FF', secondary: '#0F0A1E', accent: '#B6A6E8' }, // electric-blue
    classification: { primary: '#B6A6E8', secondary: '#0F0A1E', accent: '#4FD6FF' }, // lavender
    forecasting: { primary: '#FFC94D', secondary: '#0F0A1E', accent: '#4FD6FF' }, // pixel-gold
    xgboost: { primary: '#FF3E8E', secondary: '#0F0A1E', accent: '#4FD6FF' }, // pink-hot
  }

  const color = colors[obj.type]

  // Machine body
  ctx.fillStyle = color.secondary
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
  ctx.strokeStyle = color.primary
  ctx.lineWidth = 2
  ctx.strokeRect(obj.x, obj.y, obj.width, obj.height)

  // Machine-specific designs
  switch (obj.type) {
    case 'regression':
      // Regression machine - screen with scatter plot hint
      ctx.fillStyle = color.primary
      ctx.fillRect(obj.x + 5, obj.y + 5, obj.width - 10, obj.height - 30)
      
      // Mini scatter dots
      ctx.fillStyle = color.accent
      for (let i = 0; i < 8; i++) {
        ctx.beginPath()
        ctx.arc(obj.x + 12 + i * 4, obj.y + 20 + Math.random() * 30, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // Control panel
      ctx.fillStyle = color.secondary
      ctx.fillRect(obj.x + 5, obj.y + obj.height - 22, obj.width - 10, 18)
      ctx.strokeStyle = color.primary
      ctx.strokeRect(obj.x + 5, obj.y + obj.height - 22, obj.width - 10, 18)
      break

    case 'classification':
      // Classification machine - grid pattern
      ctx.strokeStyle = color.primary
      ctx.lineWidth = 1
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
          const cellX = obj.x + 8 + col * 12
          const cellY = obj.y + 10 + row * 18
          ctx.strokeRect(cellX, cellY, 10, 12)
          if ((row + col) % 2 === 0) {
            ctx.fillStyle = color.primary
            ctx.fillRect(cellX, cellY, 10, 12)
          }
        }
      }
      break

    case 'forecasting':
      // Forecasting crystal - hexagonal shape
      ctx.beginPath()
      const centerX = obj.x + obj.width / 2
      const centerY = obj.y + obj.height / 2
      const radius = Math.min(obj.width, obj.height) / 3
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fillStyle = color.primary
      ctx.globalAlpha = 0.3
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.strokeStyle = color.primary
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Inner glow
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = color.accent
      ctx.fill()
      break

    case 'xgboost':
      // XGBoost reactor - power core with rings
      const coreX = obj.x + obj.width / 2
      const coreY = obj.y + obj.height / 2
      
      // Outer rings
      for (let i = 3; i > 0; i--) {
        ctx.beginPath()
        ctx.arc(coreX, coreY, i * 12, 0, Math.PI * 2)
        ctx.strokeStyle = color.primary
        ctx.lineWidth = 2
        ctx.globalAlpha = 0.3 * i / 3
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      
      // Core
      ctx.beginPath()
      ctx.arc(coreX, coreY, 8, 0, Math.PI * 2)
      ctx.fillStyle = color.primary
      ctx.fill()
      
      // Energy lines
      ctx.strokeStyle = color.accent
      ctx.lineWidth = 2
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i + Math.PI / 4
        ctx.beginPath()
        ctx.moveTo(coreX, coreY)
        ctx.lineTo(coreX + Math.cos(angle) * 25, coreY + Math.sin(angle) * 25)
        ctx.stroke()
      }
      break
  }

  ctx.restore()
}

export default MLLab
