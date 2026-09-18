interface HUDProps {
  name: string
  role: string
  xp: number
  coins: number
}

function HUD({ name, role, xp, coins }: HUDProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="flex justify-between items-start p-4 text-cream bg-gradient-to-b from-navy-deep/70 to-transparent">
        {/* Left: Name and Role */}
        <div className="font-pixel text-xs space-y-1 pointer-events-auto">
          <div className="text-cream">{name}</div>
          <div className="text-lavender text-[10px]">{role}</div>
        </div>

        {/* Right: XP and Coins */}
        <div className="flex gap-4 font-pixel text-xs pointer-events-auto">
          {/* XP Counter */}
          <div className="flex items-center gap-2 bg-navy-panel/80 px-3 py-2 border border-electric-blue/30">
            <span className="text-electric-blue">★</span>
            <span className="text-cream">{xp}</span>
          </div>

          {/* Coin Counter */}
          <div className="flex items-center gap-2 bg-navy-panel/80 px-3 py-2 border border-pixel-gold/30">
            <span className="text-pixel-gold">◆</span>
            <span className="text-cream">{coins}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HUD
