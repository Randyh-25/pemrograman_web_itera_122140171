"""Modul manajemen data nilai mahasiswa.

Fitur:
- Hitung nilai akhir (30% UTS + 40% UAS + 30% Tugas)
- Tentukan grade (A,B,C,D,E)
- Tampilkan tabel data
- Cari mahasiswa nilai tertinggi & terendah
- Filter berdasarkan grade
- Hitung rata-rata kelas
"""
from typing import List, Dict, Optional

Mahasiswa = Dict[str, float]

# Sample awal (minimal 5 data)
DATA_MAHASISWA: List[Mahasiswa] = [
    {"nama": "Andi", "nim": "122140001", "nilai_uts": 78, "nilai_uas": 82, "nilai_tugas": 75},
    {"nama": "Budi", "nim": "122140002", "nilai_uts": 65, "nilai_uas": 70, "nilai_tugas": 68},
    {"nama": "Citra", "nim": "122140003", "nilai_uts": 88, "nilai_uas": 90, "nilai_tugas": 92},
    {"nama": "Dewi", "nim": "122140004", "nilai_uts": 55, "nilai_uas": 60, "nilai_tugas": 58},
    {"nama": "Eko", "nim": "122140005", "nilai_uts": 40, "nilai_uas": 50, "nilai_tugas": 45},
]

def hitung_nilai_akhir(m: Mahasiswa) -> float:
    """Hitung nilai akhir sesuai bobot: 30% UTS, 40% UAS, 30% Tugas."""
    return round(m["nilai_uts"] * 0.3 + m["nilai_uas"] * 0.4 + m["nilai_tugas"] * 0.3, 2)

def tentukan_grade(nilai_akhir: float) -> str:
    if nilai_akhir >= 80: return "A"
    if nilai_akhir >= 70: return "B"
    if nilai_akhir >= 60: return "C"
    if nilai_akhir >= 50: return "D"
    return "E"

def format_tabel(data: List[Mahasiswa]) -> str:
    """Generate string tabel untuk daftar mahasiswa."""
    headers = ["No", "Nama", "NIM", "UTS", "UAS", "Tugas", "Akhir", "Grade"]
    rows = []
    for i, m in enumerate(data, start=1):
        akhir = hitung_nilai_akhir(m)
        grade = tentukan_grade(akhir)
        rows.append([
            i, m["nama"], m["nim"], f"{m['nilai_uts']:.0f}", f"{m['nilai_uas']:.0f}", f"{m['nilai_tugas']:.0f}", f"{akhir:.2f}", grade
        ])
    # Hitung lebar kolom
    col_widths = [len(h) for h in headers]
    for r in rows:
        for ci, cell in enumerate(r):
            col_widths[ci] = max(col_widths[ci], len(str(cell)))
    def fmt_row(r):
        return " | ".join(str(c).ljust(col_widths[i]) for i, c in enumerate(r))
    garis = "-+-".join("-" * w for w in col_widths)
    out = [fmt_row(headers), garis]
    out += [fmt_row(r) for r in rows]
    return "\n".join(out)

def cari_tertinggi(data: List[Mahasiswa]) -> Mahasiswa:
    return max(data, key=lambda m: hitung_nilai_akhir(m))

def cari_terendah(data: List[Mahasiswa]) -> Mahasiswa:
    return min(data, key=lambda m: hitung_nilai_akhir(m))

def filter_by_grade(data: List[Mahasiswa], grade: str) -> List[Mahasiswa]:
    grade = grade.upper().strip()
    return [m for m in data if tentukan_grade(hitung_nilai_akhir(m)) == grade]

def rata_rata_kelas(data: List[Mahasiswa]) -> float:
    if not data: return 0.0
    total = sum(hitung_nilai_akhir(m) for m in data)
    return round(total / len(data), 2)

def tambah_mahasiswa(data: List[Mahasiswa], nama: str, nim: str, uts: float, uas: float, tugas: float) -> None:
    data.append({"nama": nama, "nim": nim, "nilai_uts": uts, "nilai_uas": uas, "nilai_tugas": tugas})

def cari_by_nim(data: List[Mahasiswa], nim: str) -> Optional[Mahasiswa]:
    return next((m for m in data if m["nim"] == nim), None)
