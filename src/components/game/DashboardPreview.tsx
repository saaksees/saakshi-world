function DashboardPreview() {
  return (
    <div className="bg-navy-panel border-2 border-lavender p-4">
      <div className="text-center mb-3">
        <p className="text-lavender text-xs font-mono">Dashboard Preview</p>
      </div>
      
      {/* Static SVG Dashboard Mockup */}
      <svg 
        viewBox="0 0 400 240" 
        className="w-full h-auto"
        style={{ maxWidth: '400px', margin: '0 auto', display: 'block' }}
        role="img"
        aria-label="Power BI dashboard mockup showing KPI cards and charts"
      >
        {/* Background */}
        <rect width="400" height="240" fill="#1B1330" />
        
        {/* KPI Cards Row */}
        <g>
          {/* Card 1 */}
          <rect x="10" y="10" width="90" height="60" fill="#0F0A1E" stroke="#B6A6E8" strokeWidth="2" />
          <text x="55" y="35" textAnchor="middle" fill="#4FD6FF" fontSize="10" fontFamily="monospace">
            Revenue
          </text>
          <text x="55" y="55" textAnchor="middle" fill="#F5EEE0" fontSize="18" fontFamily="monospace" fontWeight="bold">
            $2.4M
          </text>
          
          {/* Card 2 */}
          <rect x="110" y="10" width="90" height="60" fill="#0F0A1E" stroke="#B6A6E8" strokeWidth="2" />
          <text x="155" y="35" textAnchor="middle" fill="#4FD6FF" fontSize="10" fontFamily="monospace">
            Growth
          </text>
          <text x="155" y="55" textAnchor="middle" fill="#F5EEE0" fontSize="18" fontFamily="monospace" fontWeight="bold">
            +18%
          </text>
          
          {/* Card 3 */}
          <rect x="210" y="10" width="90" height="60" fill="#0F0A1E" stroke="#B6A6E8" strokeWidth="2" />
          <text x="255" y="35" textAnchor="middle" fill="#4FD6FF" fontSize="10" fontFamily="monospace">
            Customers
          </text>
          <text x="255" y="55" textAnchor="middle" fill="#F5EEE0" fontSize="18" fontFamily="monospace" fontWeight="bold">
            1,247
          </text>
          
          {/* Card 4 */}
          <rect x="310" y="10" width="80" height="60" fill="#0F0A1E" stroke="#B6A6E8" strokeWidth="2" />
          <text x="350" y="35" textAnchor="middle" fill="#4FD6FF" fontSize="10" fontFamily="monospace">
            Orders
          </text>
          <text x="350" y="55" textAnchor="middle" fill="#F5EEE0" fontSize="18" fontFamily="monospace" fontWeight="bold">
            3.2K
          </text>
        </g>
        
        {/* Bar Chart */}
        <g>
          <rect x="10" y="85" width="180" height="145" fill="#0F0A1E" stroke="#B6A6E8" strokeWidth="2" />
          <text x="100" y="102" textAnchor="middle" fill="#F5EEE0" fontSize="10" fontFamily="monospace">
            Sales by Region
          </text>
          
          {/* Bars */}
          <rect x="25" y="180" width="25" height="35" fill="#FF3E8E" />
          <rect x="60" y="150" width="25" height="65" fill="#FF3E8E" />
          <rect x="95" y="170" width="25" height="45" fill="#FF3E8E" />
          <rect x="130" y="135" width="25" height="80" fill="#FF3E8E" />
          <rect x="165" y="160" width="25" height="55" fill="#FF3E8E" />
          
          {/* Axis */}
          <line x1="20" y1="215" x2="190" y2="215" stroke="#B6A6E8" strokeWidth="1" />
          <line x1="20" y1="115" x2="20" y2="215" stroke="#B6A6E8" strokeWidth="1" />
        </g>
        
        {/* Line Chart */}
        <g>
          <rect x="210" y="85" width="180" height="145" fill="#0F0A1E" stroke="#B6A6E8" strokeWidth="2" />
          <text x="300" y="102" textAnchor="middle" fill="#F5EEE0" fontSize="10" fontFamily="monospace">
            Trend Analysis
          </text>
          
          {/* Line */}
          <polyline
            points="225,190 250,175 275,165 300,155 325,145 350,140 375,130"
            fill="none"
            stroke="#4FD6FF"
            strokeWidth="3"
          />
          
          {/* Data points */}
          <circle cx="225" cy="190" r="3" fill="#4FD6FF" />
          <circle cx="250" cy="175" r="3" fill="#4FD6FF" />
          <circle cx="275" cy="165" r="3" fill="#4FD6FF" />
          <circle cx="300" cy="155" r="3" fill="#4FD6FF" />
          <circle cx="325" cy="145" r="3" fill="#4FD6FF" />
          <circle cx="350" cy="140" r="3" fill="#4FD6FF" />
          <circle cx="375" cy="130" r="3" fill="#4FD6FF" />
          
          {/* Axis */}
          <line x1="220" y1="215" x2="380" y2="215" stroke="#B6A6E8" strokeWidth="1" />
          <line x1="220" y1="115" x2="220" y2="215" stroke="#B6A6E8" strokeWidth="1" />
        </g>
      </svg>
      
      <div className="text-center mt-3">
        <p className="text-lavender text-xs">
          Executive KPI Dashboard • Built with DAX measures
        </p>
      </div>
    </div>
  )
}

export default DashboardPreview
