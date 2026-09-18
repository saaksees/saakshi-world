import { Link } from 'react-router-dom'

interface SkipButtonProps {
  to: string
}

function SkipButton({ to }: SkipButtonProps) {
  return (
    <Link
      to={to}
      className="fixed bottom-6 right-6 z-50 
                 px-4 py-2 font-sans text-sm font-medium
                 bg-transparent text-lavender border-2 border-lavender 
                 hover:bg-lavender hover:bg-opacity-10 
                 active:bg-lavender active:bg-opacity-20
                 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-electric-blue 
                 transition-all duration-150"
    >
      Skip the game →
    </Link>
  )
}

export default SkipButton
