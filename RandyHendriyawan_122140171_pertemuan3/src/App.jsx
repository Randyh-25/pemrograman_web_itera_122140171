import { NavLink, Route, Routes } from 'react-router-dom'
import { BookProvider } from './context/BookContext'
import Home from './pages/Home'
import Stats from './pages/Stats'

export default function App(){
  return (
    <BookProvider>
      <div className="container">
        <header className="header">
          <h1>Aplikasi Manajemen Buku</h1>
          <nav className="nav">
            <NavLink to="/" end>Beranda</NavLink>
            <NavLink to="/stats">Statistik</NavLink>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/stats" element={<Stats/>} />
        </Routes>
      </div>
    </BookProvider>
  )
}
