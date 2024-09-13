import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Events from './pages/EventsPage'
import Home from './pages/Home'
import MerchPage from './pages/MerchPage'
import News from './pages/News'
import Setting from './pages/Setting'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/nuevo-evento' element={<Events />} />
          <Route path='/novedades' element={<News />} />
          <Route path='/merch' element={<MerchPage />} />
          <Route path='/mi-cuenta' element={<Setting />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
