import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

function renderApp(){
  return render(<BrowserRouter><App/></BrowserRouter>)
}

test('renders header and nav', () => {
  renderApp()
  expect(screen.getByText(/Aplikasi Manajemen Buku/i)).toBeInTheDocument()
  expect(screen.getByText(/Beranda/i)).toBeInTheDocument()
  expect(screen.getByText(/Statistik/i)).toBeInTheDocument()
})
