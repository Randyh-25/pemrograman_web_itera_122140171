"""
Script untuk menambahkan data awal mata kuliah
"""
from matakuliah_app.models import DBSession, Matakuliah, Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Create engine and session
engine = create_engine('sqlite:///matakuliah.sqlite')
Base.metadata.bind = engine
DBSession.configure(bind=engine)

# Data awal mata kuliah
initial_data = [
    {
        'kode_mk': 'IF101',
        'nama_mk': 'Algoritma dan Pemrograman',
        'sks': 3,
        'semester': 1
    },
    {
        'kode_mk': 'IF102',
        'nama_mk': 'Struktur Data',
        'sks': 3,
        'semester': 2
    },
    {
        'kode_mk': 'IF201',
        'nama_mk': 'Basis Data',
        'sks': 3,
        'semester': 3
    },
    {
        'kode_mk': 'IF202',
        'nama_mk': 'Pemrograman Web',
        'sks': 3,
        'semester': 4
    },
    {
        'kode_mk': 'IF301',
        'nama_mk': 'Kecerdasan Buatan',
        'sks': 3,
        'semester': 5
    }
]

def add_initial_data():
    """Menambahkan data awal ke database"""
    print("Menambahkan data awal mata kuliah...")
    
    for data in initial_data:
        # Check if already exists
        existing = DBSession.query(Matakuliah).filter_by(kode_mk=data['kode_mk']).first()
        if not existing:
            mk = Matakuliah(**data)
            DBSession.add(mk)
            print(f"✓ Ditambahkan: {data['kode_mk']} - {data['nama_mk']}")
        else:
            print(f"○ Sudah ada: {data['kode_mk']} - {data['nama_mk']}")
    
    DBSession.commit()
    print("\nData awal berhasil ditambahkan!")

if __name__ == '__main__':
    add_initial_data()
