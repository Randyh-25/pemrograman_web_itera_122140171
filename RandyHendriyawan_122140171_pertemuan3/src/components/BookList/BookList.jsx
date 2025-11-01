import BookForm from '../BookForm'

export default function BookList({ books, onEdit, onDelete }){
  if(!books.length){
    return <div className="card"><p>Tidak ada buku yang cocok.</p></div>
  }
  return (
    <div className="list">
      {books.map(b => (
        <div key={b.id} className="item" data-testid="book-item">
          <div>
            <div style={{fontWeight:600}}>{b.title}</div>
            <div style={{color:'#718096'}}>{b.author}</div>
            <div className={`badge ${b.status}`}>{b.status}</div>
          </div>
          <div className="controls">
            <button className="secondary" onClick={()=>onEdit(b)}>Edit</button>
            <button className="danger" onClick={()=>onDelete(b.id)}>Hapus</button>
          </div>
        </div>
      ))}
    </div>
  )
}
