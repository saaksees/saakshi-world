import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import Styleguide from './components/Styleguide'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/styleguide" element={<Styleguide />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
