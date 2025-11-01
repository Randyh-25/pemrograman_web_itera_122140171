import { useBooks } from '../../context/BookContext'
import { useBookStats } from '../../hooks/useBookStats'

export default function Stats(){
  const { books } = useBooks()
  const { total, milik, baca, beli } = useBookStats(books)

  return (
    <div className="grid">
      <div className="card"><h2>Total Buku</h2><p style={{fontSize:'2rem',margin:0}}>{total}</p></div>
      <div className="card"><h2>Milik</h2><p className="badge milik">{milik}</p></div>
      <div className="card"><h2>Sedang Dibaca</h2><p className="badge baca">{baca}</p></div>
      <div className="card"><h2>Ingin Dibeli</h2><p className="badge beli">{beli}</p></div>
    </div>
  )
}
