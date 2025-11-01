export default function BookFilter({ query, onQueryChange, status, onStatusChange }){
  return (
    <div className="row" role="region" aria-label="filter">
      <input
        aria-label="cari"
        placeholder="Cari judul/penulis..."
        value={query}
        onChange={e=>onQueryChange(e.target.value)}
        style={{flex:2}}
      />
      <select aria-label="filter-status" value={status} onChange={e=>onStatusChange(e.target.value)} style={{flex:1}}>
        <option value="semua">Semua</option>
        <option value="milik">Milik</option>
        <option value="baca">Sedang Dibaca</option>
        <option value="beli">Ingin Dibeli</option>
      </select>
    </div>
  )
}
