"""Contoh CLI sederhana untuk mendemokan sistem manajemen perpustakaan.
Menunjukkan penambahan item, listing, pencarian, dan pinjam/kembalikan.
"""
from library import Library
from library_items import Book, Magazine

def seed(lib: Library):
    lib.tambah_item(Book("Pemrograman Python", "Guido", 350))
    lib.tambah_item(Book("Struktur Data", "Knuth", 420))
    lib.tambah_item(Magazine("Tekno Hari Ini", 12, "November"))


def main():
    lib = Library()
    seed(lib)

    print("=== Daftar Item (awal) ===")
    for line in lib.list_items():
        print("-", line)

    # Pencarian
    print("\n=== Cari judul mengandung 'data' ===")
    for item in lib.search(keyword='data'):
        print("-", item.display_info())

    # Pinjam dan kembalikan
    first_id = lib.search(keyword='python')[0].id
    print(f"\nPinjam item #{first_id}:", 'berhasil' if lib.borrow(first_id) else 'gagal')
    print(f"Pinjam lagi item #{first_id}:", 'berhasil' if lib.borrow(first_id) else 'gagal (sudah dipinjam)')
    print(f"Kembalikan item #{first_id}:", 'berhasil' if lib.return_item(first_id) else 'gagal')

    print("\n=== Daftar Item (akhir) ===")
    for line in lib.list_items():
        print("-", line)

if __name__ == '__main__':
    main()
