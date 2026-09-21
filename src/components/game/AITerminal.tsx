import { useState, useRef, useEffect } from 'react'
import { getTerminalResponse } from '../../data/terminalResponses'

interface Message {
  type: 'user' | 'system'
  text: string
}

interface AITerminalProps {
  isOpen: boolean
  onClose: () => void
}

function AITerminal({ isOpen, onClose }: AITerminalProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'system',
      text: 'LLM Terminal v1.0 — Ask about projects, tech stack, or what she works on.',
    },
  ])
  const [cursorVisible, setCursorVisible] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = { type: 'user', text: input }
    setMessages(prev => [...prev, userMessage])

    // Get response (local matching for now, easy to replace with API later)
    const response = getTerminalResponse(input)
    const systemMessage: Message = { type: 'system', text: response }
    
    // Add system response after a short delay for more natural feel
    setTimeout(() => {
      setMessages(prev => [...prev, systemMessage])
    }, 300)

    // Clear input
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent Escape from closing modal while typing
    if (e.key === 'Escape' && input.trim()) {
      e.stopPropagation()
      setInput('')
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy-deep bg-opacity-90" />
      
      {/* Terminal */}
      <div
        className="relative w-full max-w-3xl mx-4 mb-0 sm:mb-4 bg-navy-deep border-4 border-electric-blue 
                   shadow-[8px_8px_0px_0px_rgba(79,214,255,0.5)] 
                   animate-slide-up sm:animate-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="LLM Terminal"
      >
        {/* Header */}
        <div className="bg-navy-panel border-b-2 border-electric-blue p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-hot"></div>
            <div className="w-3 h-3 rounded-full bg-pixel-gold"></div>
            <div className="w-3 h-3 rounded-full bg-electric-blue"></div>
            <span className="ml-2 font-mono text-electric-blue text-sm">LLM_Terminal.sh</span>
          </div>
          <button
            onClick={onClose}
            className="text-electric-blue hover:text-pink-hot 
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue 
                       transition-colors text-xl w-8 h-8 flex items-center justify-center"
            aria-label="Close terminal"
          >
            ×
          </button>
        </div>

        {/* Messages Log */}
        <div className="h-80 overflow-y-auto p-4 font-mono text-sm bg-navy-deep">
          {messages.map((message, i) => (
            <div key={i} className="mb-3">
              {message.type === 'user' ? (
                <div>
                  <span className="text-electric-blue">{'>'} </span>
                  <span className="text-cream">{message.text}</span>
                </div>
              ) : (
                <div className="text-lavender whitespace-pre-wrap leading-relaxed">
                  {message.text}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Line */}
        <form onSubmit={handleSubmit} className="border-t-2 border-electric-blue bg-navy-panel p-4">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-electric-blue">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-cream outline-none placeholder-lavender"
              placeholder="Type your question..."
              autoComplete="off"
              spellCheck="false"
            />
            <span className="text-cream" style={{ opacity: cursorVisible ? 1 : 0 }}>
              █
            </span>
          </div>
          <div className="mt-2 text-xs text-lavender font-mono">
            Press Enter to submit • ESC to close
          </div>
        </form>
      </div>
    </div>
  )
}

export default AITerminal
