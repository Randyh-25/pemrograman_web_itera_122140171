# Aplikasi Manajemen Profil Mahasiswa

Aplikasi web interaktif untuk mengelola data profil mahasiswa dengan menggunakan teknologi ES6+ dan localStorage untuk penyimpanan data lokal.

## Deskripsi Aplikasi

Aplikasi ini memungkinkan pengguna untuk menambah, mengedit, dan menghapus profil mahasiswa dengan fitur pencarian dan filter berdasarkan program studi dan semester.

## Screenshot Aplikasi

*Screenshot akan ditambahkan setelah aplikasi selesai*

## Fitur ES6+ yang Diimplementasikan

### 1. Classes
- `StudentProfile` - Class untuk model data mahasiswa
- `StudentManagementApp` - Class utama aplikasi

### 2. Arrow Functions (minimal 3)
```javascript
generateId() { return 'student_' + Date.now().toString() + '_' + Math.floor(Math.random() * 1000).toString(); }
getGPACategory() { return this.gpa >= 3.5 ? 'excellent' : this.gpa >= 3.0 ? 'good' : 'average'; }
escapeHtml(unsafe) { return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
```

### 3. Template Literals
Digunakan untuk rendering dinamis HTML dalam method `createStudentHTML()`

### 4. Let dan Const
Konsisten menggunakan `const` untuk nilai yang tidak berubah dan `let` untuk variabel yang dapat berubah

### 5. Async/Await atau Promises
Implementasi menggunakan Promises dalam fungsi localStorage dan error handling

### 6. Implementasi Classes yang Komprehensif
- Constructor dengan parameter
- Method untuk CRUD operations
- Inheritance dan encapsulation