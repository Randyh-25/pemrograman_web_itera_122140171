# Aplikasi Manajemen Matakuliah dengan Pyramid

Aplikasi API sederhana untuk manajemen mata kuliah menggunakan framework Pyramid dengan SQLAlchemy dan SQLite.

## Deskripsi Proyek

Aplikasi ini menyediakan REST API untuk melakukan operasi CRUD (Create, Read, Update, Delete) pada data mata kuliah. Setiap mata kuliah memiliki informasi kode, nama, jumlah SKS, dan semester.

## Fitur

- ✅ Mendapatkan semua mata kuliah
- ✅ Mendapatkan detail satu mata kuliah berdasarkan ID
- ✅ Menambahkan mata kuliah baru
- ✅ Mengupdate data mata kuliah
- ✅ Menghapus data mata kuliah
- ✅ Validasi input data
- ✅ Database migrations dengan Alembic

## Teknologi yang Digunakan

- **Framework**: Pyramid 2.0
- **Database**: SQLite dengan SQLAlchemy ORM
- **Migration**: Alembic
- **Server**: Waitress

## Cara Instalasi

### 1. Clone Repository

```bash
cd RandyHendriyawan_122140171_pertemuan6
```

### 2. Membuat Virtual Environment

```bash
# Buat virtual environment
python -m venv venv

# Aktivasi virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Windows CMD:
.\venv\Scripts\activate.bat

# Linux/Mac:
source venv/bin/activate
```

### 3. Instalasi Dependensi

```bash
# Install package dalam mode development
pip install -e .
```

### 4. Konfigurasi Database

Database SQLite akan dibuat otomatis. Konfigurasi database ada di file `development.ini`:

```ini
sqlalchemy.url = sqlite:///%(here)s/matakuliah.sqlite
```

## Cara Menjalankan

### 1. Menjalankan Migrasi Database

```bash
# Jalankan migrasi untuk membuat tabel
alembic upgrade head
```

### 2. Menambahkan Data Awal (Opsional)

```bash
# Tambahkan data awal mata kuliah
python init_data.py
```

### 3. Menjalankan Server

```bash
# Jalankan server development
pserve development.ini
```

Server akan berjalan di: `http://localhost:6543`

## API Endpoints

### 1. Get All Matakuliah

**Endpoint**: `GET /api/matakuliah`

**Deskripsi**: Mendapatkan semua data mata kuliah

**Request**:
```bash
curl -X GET http://localhost:6543/api/matakuliah
```

**Response**:
```json
{
  "matakuliahs": [
    {
      "id": 1,
      "kode_mk": "IF101",
      "nama_mk": "Algoritma dan Pemrograman",
      "sks": 3,
      "semester": 1
    },
    {
      "id": 2,
      "kode_mk": "IF102",
      "nama_mk": "Struktur Data",
      "sks": 3,
      "semester": 2
    }
  ]
}
```

### 2. Get Matakuliah by ID

**Endpoint**: `GET /api/matakuliah/{id}`

**Deskripsi**: Mendapatkan detail satu mata kuliah berdasarkan ID

**Request**:
```bash
curl -X GET http://localhost:6543/api/matakuliah/1
```

**Response**:
```json
{
  "id": 1,
  "kode_mk": "IF101",
  "nama_mk": "Algoritma dan Pemrograman",
  "sks": 3,
  "semester": 1
}
```

**Error Response** (404):
```json
{
  "error": "Matakuliah tidak ditemukan"
}
```

### 3. Create Matakuliah

**Endpoint**: `POST /api/matakuliah`

**Deskripsi**: Menambahkan mata kuliah baru

**Request**:
```bash
curl -X POST http://localhost:6543/api/matakuliah ^
  -H "Content-Type: application/json" ^
  -d "{\"kode_mk\": \"IF303\", \"nama_mk\": \"Rekayasa Perangkat Lunak\", \"sks\": 3, \"semester\": 5}"
```

**Request Body**:
```json
{
  "kode_mk": "IF303",
  "nama_mk": "Rekayasa Perangkat Lunak",
  "sks": 3,
  "semester": 5
}
```

**Response** (201):
```json
{
  "message": "Matakuliah berhasil ditambahkan",
  "matakuliah": {
    "id": 6,
    "kode_mk": "IF303",
    "nama_mk": "Rekayasa Perangkat Lunak",
    "sks": 3,
    "semester": 5
  }
}
```

**Error Response** (400):
```json
{
  "error": "Kode mata kuliah sudah digunakan"
}
```

### 4. Update Matakuliah

**Endpoint**: `PUT /api/matakuliah/{id}`

**Deskripsi**: Mengupdate data mata kuliah

**Request**:
```bash
curl -X PUT http://localhost:6543/api/matakuliah/1 ^
  -H "Content-Type: application/json" ^
  -d "{\"nama_mk\": \"Algoritma dan Pemrograman Lanjut\", \"sks\": 4}"
```

**Request Body**:
```json
{
  "nama_mk": "Algoritma dan Pemrograman Lanjut",
  "sks": 4
}
```

**Response**:
```json
{
  "message": "Matakuliah berhasil diupdate",
  "matakuliah": {
    "id": 1,
    "kode_mk": "IF101",
    "nama_mk": "Algoritma dan Pemrograman Lanjut",
    "sks": 4,
    "semester": 1
  }
}
```

### 5. Delete Matakuliah

**Endpoint**: `DELETE /api/matakuliah/{id}`

**Deskripsi**: Menghapus data mata kuliah

**Request**:
```bash
curl -X DELETE http://localhost:6543/api/matakuliah/1
```

**Response**:
```json
{
  "message": "Matakuliah berhasil dihapus",
  "id": 1
}
```

**Error Response** (404):
```json
{
  "error": "Matakuliah tidak ditemukan"
}
```

## Testing dengan PowerShell

Berikut contoh perintah testing menggunakan PowerShell:

```powershell
# 1. Get all matakuliah
Invoke-WebRequest -Uri "http://localhost:6543/api/matakuliah" -Method GET | Select-Object -ExpandProperty Content

# 2. Get one matakuliah
Invoke-WebRequest -Uri "http://localhost:6543/api/matakuliah/1" -Method GET | Select-Object -ExpandProperty Content

# 3. Create new matakuliah
$body = @{
    kode_mk = "IF304"
    nama_mk = "Machine Learning"
    sks = 3
    semester = 6
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:6543/api/matakuliah" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | Select-Object -ExpandProperty Content

# 4. Update matakuliah
$body = @{
    nama_mk = "Machine Learning Advanced"
    sks = 4
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:6543/api/matakuliah/6" `
  -Method PUT `
  -ContentType "application/json" `
  -Body $body | Select-Object -ExpandProperty Content

# 5. Delete matakuliah
Invoke-WebRequest -Uri "http://localhost:6543/api/matakuliah/6" -Method DELETE | Select-Object -ExpandProperty Content
```

## Testing dengan curl (Command Prompt)

```cmd
REM 1. Get all matakuliah
curl -X GET http://localhost:6543/api/matakuliah

REM 2. Get one matakuliah
curl -X GET http://localhost:6543/api/matakuliah/1

REM 3. Create new matakuliah
curl -X POST http://localhost:6543/api/matakuliah ^
  -H "Content-Type: application/json" ^
  -d "{\"kode_mk\": \"IF304\", \"nama_mk\": \"Machine Learning\", \"sks\": 3, \"semester\": 6}"

REM 4. Update matakuliah
curl -X PUT http://localhost:6543/api/matakuliah/1 ^
  -H "Content-Type: application/json" ^
  -d "{\"nama_mk\": \"Algoritma dan Pemrograman Lanjut\", \"sks\": 4}"

REM 5. Delete matakuliah
curl -X DELETE http://localhost:6543/api/matakuliah/1
```

## Struktur Database

### Tabel: matakuliah

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|------------|-----------|
| id | Integer | Primary Key, Auto Increment | ID unik mata kuliah |
| kode_mk | Text | Unique, Not Null | Kode mata kuliah (contoh: IF101) |
| nama_mk | Text | Not Null | Nama mata kuliah |
| sks | Integer | Not Null | Jumlah SKS (Satuan Kredit Semester) |
| semester | Integer | Not Null | Semester pengambilan |

## Struktur Proyek

```
RandyHendriyawan_122140171_pertemuan6/
├── matakuliah_app/
│   ├── __init__.py          # Konfigurasi aplikasi Pyramid
│   ├── models.py            # Model database Matakuliah
│   └── views.py             # View functions untuk API endpoints
├── alembic/
│   ├── versions/
│   │   └── 001_initial_migration.py
│   ├── env.py
│   └── script.py.mako
├── alembic.ini              # Konfigurasi Alembic
├── development.ini          # Konfigurasi development
├── production.ini           # Konfigurasi production
├── setup.py                 # Package setup
├── init_data.py             # Script untuk data awal
├── README.md                # Dokumentasi ini
└── matakuliah.sqlite        # Database SQLite (dibuat otomatis)
```

## Troubleshooting

### Error: Module not found

Pastikan sudah menginstall package dalam mode development:
```bash
pip install -e .
```

### Error: No module named 'matakuliah_app'

Pastikan menjalankan perintah dari direktori root project (RandyHendriyawan_122140171_pertemuan6).

### Error: Database is locked

Tutup semua koneksi ke database dan restart server.

### Server tidak bisa diakses

Pastikan server sudah berjalan dengan perintah:
```bash
pserve development.ini
```

Periksa port 6543 tidak digunakan oleh aplikasi lain.

## Pengembangan Lebih Lanjut

Beberapa fitur yang bisa ditambahkan:
- Autentikasi dan autorisasi
- Pagination untuk GET all matakuliah
- Filter dan search berdasarkan kode_mk, nama_mk, atau semester
- Relasi dengan tabel lain (misal: mahasiswa, dosen, jadwal)
- Unit testing
- API documentation dengan Swagger/OpenAPI

## Author

Randy Hendriyawan - 122140171

## Lisensi

Proyek ini dibuat untuk keperluan praktikum Pemrograman Web.
