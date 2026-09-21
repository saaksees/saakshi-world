import { useEffect, useState } from 'react'

interface KeyState {
  left: boolean
  right: boolean
  jump: boolean
  reset: boolean
  interact: boolean
}

export function useKeyboardControls() {
  const [keys, setKeys] = useState<KeyState>({
    left: false,
    right: false,
    jump: false,
    reset: false,
    interact: false,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          setKeys(prev => ({ ...prev, left: true }))
          break
        case 'arrowright':
        case 'd':
          setKeys(prev => ({ ...prev, right: true }))
          break
        case 'arrowup':
        case 'w':
        case ' ':
          e.preventDefault() // Prevent space from scrolling
          setKeys(prev => ({ ...prev, jump: true }))
          break
        case 'r':
          setKeys(prev => ({ ...prev, reset: true }))
          break
        case 'e':
          setKeys(prev => ({ ...prev, interact: true }))
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          setKeys(prev => ({ ...prev, left: false }))
          break
        case 'arrowright':
        case 'd':
          setKeys(prev => ({ ...prev, right: false }))
          break
        case 'arrowup':
        case 'w':
        case ' ':
          setKeys(prev => ({ ...prev, jump: false }))
          break
        case 'r':
          setKeys(prev => ({ ...prev, reset: false }))
          break
        case 'e':
          setKeys(prev => ({ ...prev, interact: false }))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return keys
}
