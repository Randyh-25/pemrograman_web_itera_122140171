import BookForm from '../../components/BookForm'
import BookList from '../../components/BookList'
import BookFilter from '../../components/BookFilter'
import { useBooks } from '../../context/BookContext'

export default function Home(){
  const { books, addBook, updateBook, deleteBook, filtered, query, setQuery, statusFilter, setStatusFilter } = useBooks()

  function handleAdd(input){
    addBook(input)
  }

  function handleEdit(book){
    const title = prompt('Ubah judul', book.title)
    if(title === null) return
    const author = prompt('Ubah penulis', book.author)
    if(author === null) return
    const status = prompt("Ubah status (milik/baca/beli)", book.status)
    if(!['milik','baca','beli'].includes(status)) return alert('Status tidak valid')
    updateBook(book.id, { title, author, status })
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>Tambah Buku</h2>
        <BookForm onSubmit={handleAdd} />
      </div>

      <div className="card">
        <h2>Filter & Pencarian</h2>
        <BookFilter query={query} onQueryChange={setQuery} status={statusFilter} onStatusChange={setStatusFilter} />
      </div>

      <div className="card">
        <h2>Daftar Buku</h2>
        <BookList books={filtered} onEdit={handleEdit} onDelete={deleteBook} />
      </div>
    </div>
  )
}
