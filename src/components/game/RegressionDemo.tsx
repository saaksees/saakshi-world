import { useEffect, useState } from 'react'

function RegressionDemo() {
  const [lineDrawn, setLineDrawn] = useState(false)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReducedMotion) {
      setLineDrawn(true)
    } else {
      // Small delay before animation starts
      const timer = setTimeout(() => setLineDrawn(true), 300)
      return () => clearTimeout(timer)
    }
  }, [prefersReducedMotion])

  // Generate scatter plot data points (toy data)
  const dataPoints = [
    { x: 20, y: 110 },
    { x: 40, y: 95 },
    { x: 60, y: 88 },
    { x: 80, y: 75 },
    { x: 100, y: 68 },
    { x: 120, y: 55 },
    { x: 140, y: 48 },
    { x: 160, y: 40 },
    { x: 180, y: 30 },
    { x: 200, y: 22 },
    { x: 220, y: 18 },
    { x: 240, y: 10 },
    // Add scatter
    { x: 35, y: 100 },
    { x: 55, y: 82 },
    { x: 75, y: 80 },
    { x: 95, y: 65 },
    { x: 115, y: 60 },
    { x: 135, y: 50 },
    { x: 155, y: 38 },
    { x: 175, y: 35 },
    { x: 195, y: 25 },
    { x: 215, y: 15 },
    { x: 45, y: 92 },
    { x: 65, y: 85 },
    { x: 85, y: 72 },
    { x: 105, y: 63 },
    { x: 125, y: 52 },
    { x: 145, y: 45 },
    { x: 165, y: 33 },
    { x: 185, y: 28 },
    { x: 205, y: 20 },
  ]

  // Regression line path
  const lineLength = Math.sqrt(Math.pow(240 - 20, 2) + Math.pow(10 - 110, 2))

  return (
    <div className="bg-navy-panel border-2 border-electric-blue p-4">
      <div className="text-center mb-3">
        <p className="text-electric-blue text-xs font-mono">Linear Regression Demo</p>
      </div>
      
      <svg 
        viewBox="0 0 280 150" 
        className="w-full h-auto"
        style={{ maxWidth: '400px', margin: '0 auto', display: 'block' }}
        role="img"
        aria-label="Linear regression visualization showing scattered data points with a fitted regression line"
      >
        {/* Background */}
        <rect width="280" height="150" fill="#0F0A1E" />
        
        {/* Axes */}
        <line x1="20" y1="130" x2="260" y2="130" stroke="#B6A6E8" strokeWidth="2" />
        <line x1="20" y1="10" x2="20" y2="130" stroke="#B6A6E8" strokeWidth="2" />
        
        {/* Axis labels */}
        <text x="140" y="145" textAnchor="middle" fill="#B6A6E8" fontSize="8" fontFamily="monospace">
          Feature (X)
        </text>
        <text x="8" y="75" textAnchor="middle" fill="#B6A6E8" fontSize="8" fontFamily="monospace" transform="rotate(-90, 8, 75)">
          Target (Y)
        </text>
        
        {/* Data points */}
        <g>
          {dataPoints.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="3"
              fill="#F7A8C4"
              opacity="0.8"
            />
          ))}
        </g>
        
        {/* Regression line */}
        <line
          x1="20"
          y1="110"
          x2="240"
          y2="10"
          stroke="#4FD6FF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={lineLength}
          strokeDashoffset={lineDrawn ? 0 : lineLength}
          style={{
            transition: prefersReducedMotion ? 'none' : 'stroke-dashoffset 1.5s ease-out'
          }}
        />
        
        {/* Equation */}
        <text x="140" y="25" textAnchor="middle" fill="#F5EEE0" fontSize="9" fontFamily="monospace">
          y = -0.45x + 115
        </text>
      </svg>
      
      <div className="text-center mt-3">
        <p className="text-lavender text-xs">
          Fitted line minimizes squared error • R² = 0.94
        </p>
      </div>
    </div>
  )
}

export default RegressionDemo
