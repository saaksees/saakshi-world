import GameCanvas from './game/GameCanvas'

function Game() {
  return (
    <div className="min-h-screen bg-navy-deep flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl h-[600px] border-4 border-lavender shadow-[8px_8px_0px_0px_rgba(182,166,232,0.3)]">
          <GameCanvas />
        </div>
      </div>
      <div className="p-4 text-center">
        <p className="text-cream font-sans text-sm">
          Use <kbd className="font-mono text-xs bg-navy-panel px-2 py-1 border border-lavender">←→</kbd>
          {' '}or{' '}
          <kbd className="font-mono text-xs bg-navy-panel px-2 py-1 border border-lavender">A D</kbd>
          {' '}to move,{' '}
          <kbd className="font-mono text-xs bg-navy-panel px-2 py-1 border border-lavender">Space</kbd>
          {' '}or{' '}
          <kbd className="font-mono text-xs bg-navy-panel px-2 py-1 border border-lavender">↑</kbd>
          {' '}or{' '}
          <kbd className="font-mono text-xs bg-navy-panel px-2 py-1 border border-lavender">W</kbd>
          {' '}to jump,{' '}
          <kbd className="font-mono text-xs bg-navy-panel px-2 py-1 border border-lavender">R</kbd>
          {' '}to reset
        </p>
      </div>
    </div>
  )
}

export default Game
