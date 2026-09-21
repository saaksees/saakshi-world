import { useEffect, useState } from 'react'

function ForecastDemo() {
  const [lineDrawn, setLineDrawn] = useState(false)
  const [bandVisible, setBandVisible] = useState(false)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReducedMotion) {
      setLineDrawn(true)
      setBandVisible(true)
    } else {
      // Draw line first
      const lineTimer = setTimeout(() => setLineDrawn(true), 300)
      // Then show confidence band
      const bandTimer = setTimeout(() => setBandVisible(true), 1800)
      return () => {
        clearTimeout(lineTimer)
        clearTimeout(bandTimer)
      }
    }
  }, [prefersReducedMotion])

  // Time series data points
  const dataPoints = [
    { x: 30, y: 90 },
    { x: 50, y: 85 },
    { x: 70, y: 80 },
    { x: 90, y: 75 },
    { x: 110, y: 70 },
    { x: 130, y: 68 },
    { x: 150, y: 65 },
    { x: 170, y: 60 },
    { x: 190, y: 55 },
    { x: 210, y: 50 },
    { x: 230, y: 48 },
  ]

  // Confidence band upper and lower bounds
  const upperBand = [
    { x: 30, y: 78 },
    { x: 50, y: 73 },
    { x: 70, y: 68 },
    { x: 90, y: 63 },
    { x: 110, y: 58 },
    { x: 130, y: 56 },
    { x: 150, y: 53 },
    { x: 170, y: 48 },
    { x: 190, y: 43 },
    { x: 210, y: 38 },
    { x: 230, y: 36 },
  ]

  const lowerBand = [
    { x: 30, y: 102 },
    { x: 50, y: 97 },
    { x: 70, y: 92 },
    { x: 90, y: 87 },
    { x: 110, y: 82 },
    { x: 130, y: 80 },
    { x: 150, y: 77 },
    { x: 170, y: 72 },
    { x: 190, y: 67 },
    { x: 210, y: 62 },
    { x: 230, y: 60 },
  ]

  // Create path strings
  const linePath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const upperPath = upperBand.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const lowerPath = lowerBand.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  
  // Confidence band area (upper path + reversed lower path)
  const bandPath = upperPath + ' ' + lowerBand.slice().reverse().map(p => `L ${p.x} ${p.y}`).join(' ') + ' Z'

  // Calculate line length for animation
  const calculatePathLength = (points: typeof dataPoints) => {
    let length = 0
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x
      const dy = points[i].y - points[i - 1].y
      length += Math.sqrt(dx * dx + dy * dy)
    }
    return length
  }

  const lineLength = calculatePathLength(dataPoints)

  return (
    <div className="bg-navy-panel border-2 border-electric-blue p-4">
      <div className="text-center mb-3">
        <p className="text-electric-blue text-xs font-mono">Time Series Forecast Demo</p>
      </div>
      
      <svg 
        viewBox="0 0 280 150" 
        className="w-full h-auto"
        style={{ maxWidth: '400px', margin: '0 auto', display: 'block' }}
        role="img"
        aria-label="Time series forecast visualization showing historical data trend with confidence interval bands"
      >
        {/* Background */}
        <rect width="280" height="150" fill="#0F0A1E" />
        
        {/* Axes */}
        <line x1="20" y1="120" x2="260" y2="120" stroke="#B6A6E8" strokeWidth="2" />
        <line x1="20" y1="20" x2="20" y2="120" stroke="#B6A6E8" strokeWidth="2" />
        
        {/* Axis labels */}
        <text x="140" y="138" textAnchor="middle" fill="#B6A6E8" fontSize="8" fontFamily="monospace">
          Time →
        </text>
        <text x="8" y="70" textAnchor="middle" fill="#B6A6E8" fontSize="8" fontFamily="monospace" transform="rotate(-90, 8, 70)">
          Value
        </text>
        
        {/* Confidence band (appears after line) */}
        <path
          d={bandPath}
          fill="#4FD6FF"
          opacity={bandVisible ? 0.2 : 0}
          style={{
            transition: prefersReducedMotion ? 'none' : 'opacity 0.8s ease-in'
          }}
        />
        
        {/* Upper bound line */}
        <path
          d={upperPath}
          fill="none"
          stroke="#4FD6FF"
          strokeWidth="1"
          strokeDasharray="4,2"
          opacity={bandVisible ? 0.5 : 0}
          style={{
            transition: prefersReducedMotion ? 'none' : 'opacity 0.8s ease-in'
          }}
        />
        
        {/* Lower bound line */}
        <path
          d={lowerPath}
          fill="none"
          stroke="#4FD6FF"
          strokeWidth="1"
          strokeDasharray="4,2"
          opacity={bandVisible ? 0.5 : 0}
          style={{
            transition: prefersReducedMotion ? 'none' : 'opacity 0.8s ease-in'
          }}
        />
        
        {/* Forecast line (animates drawing) */}
        <path
          d={linePath}
          fill="none"
          stroke="#4FD6FF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={lineLength}
          strokeDashoffset={lineDrawn ? 0 : lineLength}
          style={{
            transition: prefersReducedMotion ? 'none' : 'stroke-dashoffset 1.5s ease-out'
          }}
        />
        
        {/* Data points */}
        <g>
          {dataPoints.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="2.5"
              fill="#F5EEE0"
              opacity={lineDrawn ? 0.9 : 0}
              style={{
                transition: prefersReducedMotion ? 'none' : 'opacity 0.3s ease-in',
                transitionDelay: prefersReducedMotion ? '0s' : '1.2s'
              }}
            />
          ))}
        </g>
        
        {/* Legend */}
        <g opacity={bandVisible ? 1 : 0} style={{ transition: prefersReducedMotion ? 'none' : 'opacity 0.5s ease-in' }}>
          <line x1="200" y1="35" x2="220" y2="35" stroke="#4FD6FF" strokeWidth="3" />
          <text x="225" y="38" fill="#F5EEE0" fontSize="7" fontFamily="monospace">Forecast</text>
          
          <rect x="200" y="44" width="20" height="8" fill="#4FD6FF" opacity="0.2" />
          <text x="225" y="50" fill="#F5EEE0" fontSize="7" fontFamily="monospace">95% CI</text>
        </g>
      </svg>
      
      <div className="text-center mt-3">
        <p className="text-lavender text-xs">
          Prophet model • Next 30 days with confidence intervals
        </p>
      </div>
    </div>
  )
}

export default ForecastDemo
