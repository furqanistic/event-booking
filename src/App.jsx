import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Events from './pages/EventsPage'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import MerchPage from './pages/MerchPage'
import News from './pages/News'
import Setting from './pages/Setting'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route index element={<LoginPage />} />
            <Route path='dashboard' element={<Home />} />
            <Route path='login' element={<LoginPage />} />
            <Route path='nuevo-evento' element={<Events />} />
            <Route path='novedades' element={<News />} />
            <Route path='merch' element={<MerchPage />} />
            <Route path='mi-cuenta' element={<Setting />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
