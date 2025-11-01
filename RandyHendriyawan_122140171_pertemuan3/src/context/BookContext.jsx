import { createContext, useContext, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const BookContext = createContext()

export function BookProvider({ children }){
  const [stored, setStored] = useLocalStorage('books', [])
  const [books, setBooks] = useState(stored)

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('semua')

  function sync(next){
    setBooks(next)
    setStored(next)
  }

  function addBook({ title, author, status }){
    const id = crypto.randomUUID()
    const next = [{ id, title, author, status }, ...books]
    sync(next)
  }

  function updateBook(id, patch){
    const next = books.map(b => b.id === id ? { ...b, ...patch } : b)
    sync(next)
  }

  function deleteBook(id){
    const next = books.filter(b => b.id !== id)
    sync(next)
  }

  const filtered = useMemo(() => {
    let data = books
    if(statusFilter !== 'semua') data = data.filter(b => b.status === statusFilter)
    if(query.trim()){
      const q = query.toLowerCase()
      data = data.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
    }
    return data
  }, [books, query, statusFilter])

  const value = {
    books,
    addBook,
    updateBook,
    deleteBook,
    query, setQuery,
    statusFilter, setStatusFilter,
    filtered
  }

  return (
    <BookContext.Provider value={value}>{children}</BookContext.Provider>
  )
}

export function useBooks(){
  const ctx = useContext(BookContext)
  if(!ctx) throw new Error('useBooks must be used within BookProvider')
  return ctx
}
