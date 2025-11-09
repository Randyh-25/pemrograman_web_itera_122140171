"""Class Library untuk mengelola koleksi item perpustakaan.

Fungsi utama:
- tambah_item: menambahkan item (Book/Magazine)
- list_items: menampilkan semua item (polymorphism display_info)
- search: mencari berdasarkan title substring atau id
- borrow/return: contoh penggunaan enkapsulasi status available
"""
from __future__ import annotations
from typing import List, Optional, Iterable
from library_items import LibraryItem

class Library:
    def __init__(self) -> None:
        # enkapsulasi: koleksi disimpan pada atribut protected
        self._items: List[LibraryItem] = []

    def tambah_item(self, item: LibraryItem) -> None:
        self._items.append(item)

    def list_items(self) -> List[str]:
        return [i.display_info() for i in self._items]

    def search(self, keyword: Optional[str] = None, id: Optional[int] = None) -> List[LibraryItem]:
        result: List[LibraryItem] = self._items
        if id is not None:
            result = [i for i in result if i.id == id]
        if keyword:
            kw = keyword.lower()
            result = [i for i in result if kw in i.title.lower()]
        return result

    def borrow(self, id: int) -> bool:
        found = self.search(id=id)
        if not found:
            return False
        item = found[0]
        if not item.available:
            return False
        item.mark_borrowed()
        return True

    def return_item(self, id: int) -> bool:
        found = self.search(id=id)
        if not found:
            return False
        item = found[0]
        if item.available:
            return False
        item.mark_returned()
        return True
