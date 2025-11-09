from student_manager import (
    DATA_MAHASISWA,
    format_tabel,
    tambah_mahasiswa,
    cari_tertinggi,
    cari_terendah,
    rata_rata_kelas,
    filter_by_grade,
    cari_by_nim,
)


def input_float(prompt: str) -> float:
    while True:
        try:
            v = float(input(prompt))
            if v < 0 or v > 100:
                print("Nilai harus 0-100.")
                continue
            return v
        except ValueError:
            print("Input tidak valid, masukkan angka.")


def menu():
    print("\n=== Program Pengelolaan Data Nilai Mahasiswa ===")
    print("1. Tampilkan semua data")
    print("2. Tambah data mahasiswa")
    print("3. Cari nilai tertinggi & terendah")
    print("4. Filter mahasiswa berdasarkan grade")
    print("5. Hitung rata-rata nilai kelas")
    print("6. Cari mahasiswa berdasarkan NIM")
    print("0. Keluar")


def main():
    data = DATA_MAHASISWA.copy()
    while True:
        menu()
        pilihan = input("Pilih menu: ").strip()
        if pilihan == "1":
            print()
            print(format_tabel(data))
        elif pilihan == "2":
            print("\nInput Data Mahasiswa Baru")
            nama = input("Nama: ").strip()
            nim = input("NIM: ").strip()
            uts = input_float("Nilai UTS (0-100): ")
            uas = input_float("Nilai UAS (0-100): ")
            tugas = input_float("Nilai Tugas (0-100): ")
            tambah_mahasiswa(data, nama, nim, uts, uas, tugas)
            print("Data berhasil ditambahkan!\n")
        elif pilihan == "3":
            tertinggi = cari_tertinggi(data)
            terendah = cari_terendah(data)
            print("\nMahasiswa Nilai Tertinggi:")
            print(format_tabel([tertinggi]))
            print("\nMahasiswa Nilai Terendah:")
            print(format_tabel([terendah]))
        elif pilihan == "4":
            g = input("Masukkan grade (A/B/C/D/E): ").upper().strip()
            hasil = filter_by_grade(data, g)
            if hasil:
                print()
                print(format_tabel(hasil))
            else:
                print(f"Tidak ada mahasiswa dengan grade {g}.")
        elif pilihan == "5":
            avg = rata_rata_kelas(data)
            print(f"\nRata-rata nilai akhir kelas: {avg:.2f}")
        elif pilihan == "6":
            nim = input("Masukkan NIM: ").strip()
            m = cari_by_nim(data, nim)
            if m:
                print(format_tabel([m]))
            else:
                print("Mahasiswa tidak ditemukan.")
        elif pilihan == "0":
            print("Terima kasih. Keluar.")
            break
        else:
            print("Pilihan tidak dikenal, coba lagi.")


if __name__ == "__main__":
    main()
