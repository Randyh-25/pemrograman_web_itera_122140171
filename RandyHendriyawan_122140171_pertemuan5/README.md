# Sistem Manajemen Perpustakaan Sederhana (Pertemuan 5)

Program OOP Python yang mendemokan penggunaan Abstract Class, Inheritance, Encapsulation, dan Polymorphism.

## Fitur
- Abstract class `LibraryItem` sebagai dasar item
- Subclass: `Book` dan `Magazine`
- Enkapsulasi data (`id`, `available`) dan akses via property/method
- Polymorphism melalui `display_info()` yang di-override di subclass
- Class `Library` untuk menambah, menampilkan, mencari item, serta pinjam/kembali

## Struktur Folder
```
pertemuan5/
├── library_items.py  # ABC + kelas turunan
├── library.py        # pengelola koleksi
├── main.py           # contoh penggunaan / CLI sederhana
└── README.md         # dokumentasi
```

## Cara Menjalankan
```bash
python main.py
```

## Contoh Keluaran (ringkas)
```
=== Daftar Item (awal) ===
- [Book] #1 'Pemrograman Python' oleh Guido, 350 hlm — Tersedia
- [Book] #2 'Struktur Data' oleh Knuth, 420 hlm — Tersedia
- [Magazine] #3 'Tekno Hari Ini' edisi 12 (November) — Tersedia

=== Cari judul mengandung 'data' ===
- [Book] #2 'Struktur Data' oleh Knuth, 420 hlm — Tersedia

Pinjam item #1: berhasil
Pinjam lagi item #1: gagal (sudah dipinjam)
Kembalikan item #1: berhasil

=== Daftar Item (akhir) ===
- [Book] #1 'Pemrograman Python' oleh Guido, 350 hlm — Tersedia
- [Book] #2 'Struktur Data' oleh Knuth, 420 hlm — Tersedia
- [Magazine] #3 'Tekno Hari Ini' edisi 12 (November) — Tersedia
```

## Catatan
- `id` item di-generate otomatis melalui variabel kelas `_next_id`.
- Atribut `__available` bersifat private dan hanya bisa diubah lewat method `mark_borrowed/mark_returned`.
- `title` menggunakan property dengan validasi agar tidak kosong.


```
