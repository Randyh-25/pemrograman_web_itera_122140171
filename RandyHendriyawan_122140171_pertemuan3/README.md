# Aplikasi Manajemen Buku Pribadi

Aplikasi React untuk mengelola daftar buku yang dimiliki, sedang dibaca, atau ingin dibeli.

## Fitur
- Tambah, edit, hapus buku (judul, penulis, status: milik/baca/beli)
- Filter berdasarkan status dan pencarian judul/penulis
- Penyimpanan data di `localStorage`
- Routing: Beranda dan Statistik
- Context API untuk state management
- Hooks kustom: `useLocalStorage`, `useBookStats`
- 5+ unit test menggunakan React Testing Library + Vitest

## Struktur Folder
```
src/
├── components/
│   ├── BookForm/
│   ├── BookList/
│   └── BookFilter/
├── context/
│   └── BookContext.jsx
├── hooks/
│   ├── useBookStats.js
│   └── useLocalStorage.js
├── pages/
│   ├── Home/
│   └── Stats/
└── App.jsx
```

## Menjalankan
1. Install dependency
```bash
npm install
```
2. Jalankan dev server
```bash
npm run dev
```
3. Tes unit
```bash
npm test
```

## Screenshot
Tambahkan screenshot tampilan Beranda dan Statistik di sini.

## Catatan Teknis
- Functional components dengan Hooks
- Validasi form sederhana dan pesan error ditampilkan di bawah input
- Data disimpan otomatis ke `localStorage` dan dipulihkan saat reload

## Lisensi
MIT
