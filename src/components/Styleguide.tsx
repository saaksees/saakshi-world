import { useState } from 'react'
import Button from './ui/Button'
import Modal from './ui/Modal'
import HUD from './ui/HUD'
import SkipButton from './ui/SkipButton'

function Styleguide() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-navy-deep text-cream font-sans">
      {/* HUD Overlay */}
      <HUD name="Saakshi" role="Developer" xp={1337} coins={42} />

      {/* Skip Button */}
      <SkipButton to="/" />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-24 space-y-16">
        {/* Header */}
        <section>
          <h1 className="font-pixel text-4xl text-cream mb-4">
            Design System
          </h1>
          <p className="text-lavender text-lg max-w-2xl">
            A styleguide showcasing the SAAKSHI WORLD visual language: 
            retro-pixel game meets modern, readable UI.
          </p>
        </section>

        {/* Colors */}
        <section>
          <h2 className="font-pixel text-2xl text-cream mb-6">Color Tokens</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="h-24 bg-navy-deep border-2 border-cream mb-2"></div>
              <p className="font-mono text-xs text-cream">navy-deep</p>
              <p className="font-mono text-[10px] text-lavender">#0F0A1E</p>
            </div>
            <div>
              <div className="h-24 bg-navy-panel border-2 border-cream mb-2"></div>
              <p className="font-mono text-xs text-cream">navy-panel</p>
              <p className="font-mono text-[10px] text-lavender">#1B1330</p>
            </div>
            <div>
              <div className="h-24 bg-pink-soft border-2 border-cream mb-2"></div>
              <p className="font-mono text-xs text-cream">pink-soft</p>
              <p className="font-mono text-[10px] text-lavender">#F7A8C4</p>
            </div>
            <div>
              <div className="h-24 bg-pink-hot border-2 border-cream mb-2"></div>
              <p className="font-mono text-xs text-cream">pink-hot</p>
              <p className="font-mono text-[10px] text-lavender">#FF3E8E</p>
            </div>
            <div>
              <div className="h-24 bg-lavender border-2 border-cream mb-2"></div>
              <p className="font-mono text-xs text-cream">lavender</p>
              <p className="font-mono text-[10px] text-lavender">#B6A6E8</p>
            </div>
            <div>
              <div className="h-24 bg-cream border-2 border-navy-deep mb-2"></div>
              <p className="font-mono text-xs text-cream">cream</p>
              <p className="font-mono text-[10px] text-lavender">#F5EEE0</p>
            </div>
            <div>
              <div className="h-24 bg-pixel-gold border-2 border-cream mb-2"></div>
              <p className="font-mono text-xs text-cream">pixel-gold</p>
              <p className="font-mono text-[10px] text-lavender">#FFC94D</p>
            </div>
            <div>
              <div className="h-24 bg-electric-blue border-2 border-cream mb-2"></div>
              <p className="font-mono text-xs text-cream">electric-blue</p>
              <p className="font-mono text-[10px] text-lavender">#4FD6FF</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="font-pixel text-2xl text-cream mb-6">Typography</h2>
          <div className="space-y-6 bg-navy-panel p-6 border-2 border-lavender">
            <div>
              <p className="font-mono text-xs text-lavender mb-2">font-pixel (Press Start 2P) - Headings & HUD only</p>
              <h3 className="font-pixel text-xl text-cream">The quick brown fox jumps</h3>
            </div>
            <div>
              <p className="font-mono text-xs text-lavender mb-2">font-sans (Inter) - Body copy</p>
              <p className="text-cream text-base">
                The quick brown fox jumps over the lazy dog. This is readable paragraph text 
                designed for longer-form content and descriptions.
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-lavender mb-2">font-mono (JetBrains Mono) - Tags & technical labels</p>
              <div className="flex gap-2 flex-wrap">
                <span className="font-mono text-xs bg-navy-deep text-electric-blue px-2 py-1 border border-electric-blue">TypeScript</span>
                <span className="font-mono text-xs bg-navy-deep text-pixel-gold px-2 py-1 border border-pixel-gold">React</span>
                <span className="font-mono text-xs bg-navy-deep text-pink-soft px-2 py-1 border border-pink-soft">Tailwind</span>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="font-pixel text-2xl text-cream mb-6">Buttons</h2>
          <div className="space-y-6">
            <div className="bg-navy-panel p-6 border-2 border-lavender">
              <p className="font-mono text-xs text-lavender mb-4">Primary Variant</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">
                  Start Adventure
                </Button>
                <Button variant="primary" disabled>
                  Disabled State
                </Button>
              </div>
            </div>
            <div className="bg-navy-panel p-6 border-2 border-lavender">
              <p className="font-mono text-xs text-lavender mb-4">Secondary Variant</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary">
                  View Projects
                </Button>
                <Button variant="secondary" disabled>
                  Disabled State
                </Button>
              </div>
            </div>
          </div>
          <p className="text-lavender text-sm mt-4">
            💡 Tip: Tab through the buttons to see focus states (electric-blue ring)
          </p>
        </section>

        {/* Modal */}
        <section>
          <h2 className="font-pixel text-2xl text-cream mb-6">Modal (Dialogue Box)</h2>
          <div className="bg-navy-panel p-6 border-2 border-lavender">
            <p className="text-lavender mb-4">
              Opens from bottom on mobile, centered on desktop. Press Escape or click backdrop to close.
            </p>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>
          </div>
          <p className="text-lavender text-sm mt-4">
            💡 Tip: When modal opens, focus is trapped. Tab between close button and the button inside.
          </p>
        </section>

        {/* HUD */}
        <section>
          <h2 className="font-pixel text-2xl text-cream mb-6">HUD (Heads-Up Display)</h2>
          <div className="bg-navy-panel p-6 border-2 border-lavender">
            <p className="text-lavender">
              Fixed overlay shown at the top of this page. Semi-transparent, small, 
              shows name/role on left, XP (★) and coins (◆) on right.
            </p>
          </div>
        </section>

        {/* Skip Button */}
        <section>
          <h2 className="font-pixel text-2xl text-cream mb-6">Skip Button</h2>
          <div className="bg-navy-panel p-6 border-2 border-lavender">
            <p className="text-lavender">
              Persistent "Skip the game →" button visible at bottom-right of this page.
              Always accessible, styled as secondary variant.
            </p>
          </div>
        </section>

        {/* Accessibility Notice */}
        <section className="border-4 border-electric-blue bg-navy-panel p-8">
          <h2 className="font-pixel text-xl text-electric-blue mb-4">
            ♿ Keyboard Navigation Test
          </h2>
          <div className="space-y-2 text-cream">
            <p>✓ Tab through all interactive elements</p>
            <p>✓ Focus states are visible (electric-blue ring)</p>
            <p>✓ Modal traps focus when open</p>
            <p>✓ Modal closes on Escape key</p>
            <p>✓ All buttons and links are keyboard-accessible</p>
          </div>
        </section>
      </div>

      {/* Modal Instance */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Welcome to the Dialogue"
      >
        <p className="mb-4">
          This modal slides up from the bottom on mobile and appears centered on desktop. 
          It has a retro dialogue box aesthetic with a lavender border.
        </p>
        <p className="mb-6">
          Try pressing <kbd className="font-mono text-xs bg-navy-deep px-2 py-1 border border-lavender">Escape</kbd> 
          {' '}or clicking outside to close it. Focus is trapped within this modal.
        </p>
        <Button variant="primary" onClick={() => setIsModalOpen(false)}>
          Got it!
        </Button>
      </Modal>
    </div>
  )
}

export default Styleguide
