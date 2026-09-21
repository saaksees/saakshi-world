import { Project } from '../../data/projects'

interface BossLevelProps {
  project: Project
  onInvestigate: () => void
}

function BossLevel({ project, onInvestigate }: BossLevelProps) {
  return (
    <div className="relative group">
      {/* Glitch effect container */}
      <div className="relative bg-navy-deep border-4 border-pink-hot p-8 overflow-hidden">
        {/* Background data storm */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-electric-blue"
                style={{
                  width: `${Math.random() * 100}px`,
                  height: '2px',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Glitch bars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-full h-1 bg-pink-hot opacity-50 animate-pulse"
               style={{ top: '20%', animationDuration: '3s' }} />
          <div className="absolute w-full h-1 bg-electric-blue opacity-50 animate-pulse"
               style={{ top: '60%', animationDuration: '2.5s', animationDelay: '0.5s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="mb-4">
            <span className="text-pink-hot font-pixel text-xs bg-pink-hot bg-opacity-20 px-3 py-1 border border-pink-hot inline-block mb-3">
              ⚔ BOSS LEVEL
            </span>
            <h3 className="text-cream font-pixel text-xl mb-2 drop-shadow-[0_0_10px_rgba(255,62,142,0.5)]">
              THE REVENUE RISK MONSTER
            </h3>
          </div>

          <div className="mb-6">
            <p className="text-pink-hot font-pixel text-2xl mb-3">
              {project.title}
            </p>
            <p className="text-lavender text-base italic mb-4">
              "{project.tagline}"
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {project.stats.map((stat, i) => (
                <span
                  key={i}
                  className="font-mono text-xs bg-navy-panel text-electric-blue px-3 py-1.5 border border-electric-blue"
                >
                  {stat}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={onInvestigate}
            className="w-full px-6 py-4 font-pixel text-base
                       bg-pink-hot text-navy-deep
                       hover:bg-opacity-90 hover:shadow-[0_0_20px_rgba(255,62,142,0.6)]
                       focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-electric-blue
                       transition-all duration-300"
          >
            [ INVESTIGATE ]
          </button>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-electric-blue" />
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-pink-hot" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-pink-hot" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-electric-blue" />
      </div>

      {/* Outer glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pink-hot to-electric-blue opacity-20 blur-xl
                      group-hover:opacity-30 transition-opacity" />
    </div>
  )
}

export default BossLevel
