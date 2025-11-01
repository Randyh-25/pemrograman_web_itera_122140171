import { render, screen } from '@testing-library/react'
import BookList from '../components/BookList'

test('renders empty state', () => {
  render(<BookList books={[]} onEdit={()=>{}} onDelete={()=>{}} />)
  expect(screen.getByText(/Tidak ada buku yang cocok/i)).toBeInTheDocument()
})

test('renders list items', () => {
  const books = [{id:'1', title:'A', author:'B', status:'milik'}]
  render(<BookList books={books} onEdit={()=>{}} onDelete={()=>{}} />)
  expect(screen.getAllByTestId('book-item').length).toBe(1)
})
