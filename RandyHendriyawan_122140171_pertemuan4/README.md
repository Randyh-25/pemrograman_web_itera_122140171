# Program Pengelolaan Data Nilai Mahasiswa

Aplikasi CLI sederhana (Python) untuk mengelola data nilai mahasiswa.

## Fitur Utama
- Data awal 5 mahasiswa (nama, NIM, nilai UTS, UAS, Tugas)
- Hitung nilai akhir (30% UTS + 40% UAS + 30% Tugas)
- Tentukan grade (A≥80, B≥70, C≥60, D≥50, E<50)
- Tampilkan semua data dalam bentuk tabel teks
- Tambah data mahasiswa baru
- Cari mahasiswa nilai tertinggi & terendah
- Filter berdasarkan grade
- Hitung rata-rata nilai kelas
- Cari mahasiswa berdasarkan NIM

## Struktur Proyek
```
pertemuan4/
├── main.py            # Entry point CLI
├── student_manager.py # Fungsi manajemen data
└── README.md          # Dokumentasi
```

## Cara Menjalankan
Pastikan sudah terinstall Python 3.8+.

```bash
python main.py
```

## Contoh Interaksi Menu
```
=== Program Pengelolaan Data Nilai Mahasiswa ===
1. Tampilkan semua data
2. Tambah data mahasiswa
3. Cari nilai tertinggi & terendah
4. Filter mahasiswa berdasarkan grade
5. Hitung rata-rata nilai kelas
6. Cari mahasiswa berdasarkan NIM
0. Keluar
Pilih menu: 1
```

## Validasi Input
- Nilai harus 0-100 (UTS/UAS/Tugas)
- Grade difilter hanya A/B/C/D/E
- NIM dicari exact match
