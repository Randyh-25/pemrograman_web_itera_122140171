import { useEffect, useState } from 'react'

const initial = { title: '', author: '', status: 'milik' }

export default function BookForm({ onSubmit, initialData, submitLabel = 'Tambah Buku' }){
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if(initialData){
      setForm({ title: initialData.title, author: initialData.author, status: initialData.status })
    }
  }, [initialData])

  function validate(){
    const e = {}
    if(!form.title.trim()) e.title = 'Judul wajib diisi'
    if(!form.author.trim()) e.author = 'Penulis wajib diisi'
    if(!form.status) e.status = 'Status wajib dipilih'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev){
    ev.preventDefault()
    if(!validate()) return
    onSubmit({ ...form })
    if(!initialData) setForm(initial)
  }

  return (
    <form onSubmit={handleSubmit} aria-label="form-buku" className="grid">
      <div className="row">
        <div style={{flex:1}}>
          <label>
            Judul
            <input aria-label="judul" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
          </label>
          {errors.title && <div className="error" role="alert">{errors.title}</div>}
        </div>
        <div style={{flex:1}}>
          <label>
            Penulis
            <input aria-label="penulis" value={form.author} onChange={e=>setForm(f=>({...f,author:e.target.value}))} />
          </label>
          {errors.author && <div className="error" role="alert">{errors.author}</div>}
        </div>
        <div>
          <label>
            Status
            <select aria-label="status" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
              <option value="milik">Milik</option>
              <option value="baca">Sedang Dibaca</option>
              <option value="beli">Ingin Dibeli</option>
            </select>
          </label>
          {errors.status && <div className="error" role="alert">{errors.status}</div>}
        </div>
      </div>
      <div className="row">
        <button type="submit">{submitLabel}</button>
      </div>
    </form>
  )
}
