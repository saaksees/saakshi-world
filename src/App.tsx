import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import Styleguide from './components/Styleguide'
import Game from './components/Game'
import DataValley from './worlds/DataValley'
import AnalyticsCity from './worlds/AnalyticsCity'
import MLLab from './worlds/MLLab'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/styleguide" element={<Styleguide />} />
        <Route path="/game" element={<Game />} />
        <Route path="/world/data-valley" element={<DataValley />} />
        <Route path="/world/analytics-city" element={<AnalyticsCity />} />
        <Route path="/world/ml-lab" element={<MLLab />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
