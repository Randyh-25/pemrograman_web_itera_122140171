"""Definisi item perpustakaan menggunakan OOP dengan ABC, enkapsulasi, dan properti.

- LibraryItem: Abstract base class untuk seluruh item. Memiliki id, title, dan status ketersediaan.
- Book: Subclass dari LibraryItem dengan atribut author dan pages.
- Magazine: Subclass dari LibraryItem dengan atribut issue dan month.

Konsep yang diterapkan:
- Abstract Class & Inheritance (ABC -> Book/Magazine)
- Encapsulation (atribut private/protected, accessor melalui property)
- Polymorphism (implementasi method abstrak display_info di masing-masing subclass)
"""
from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Any

class LibraryItem(ABC):
    """Abstract class untuk semua item perpustakaan."""

    _next_id: int = 1  # protected class variable untuk auto-increment id

    def __init__(self, title: str) -> None:
        # enkapsulasi menggunakan atribut private
        self.__id: int = LibraryItem._next_id
        LibraryItem._next_id += 1

        self._title: str = title  # protected agar bisa diakses subclass
        self.__available: bool = True  # status private, ubah via method/property

    @property
    def id(self) -> int:
        """ID unik untuk item (read-only)."""
        return self.__id

    @property
    def title(self) -> str:
        return self._title

    @title.setter
    def title(self, value: str) -> None:
        if not value.strip():
            raise ValueError("Judul tidak boleh kosong")
        self._title = value

    @property
    def available(self) -> bool:
        return self.__available

    def mark_borrowed(self) -> None:
        if not self.__available:
            raise RuntimeError("Item sudah dipinjam")
        self.__available = False

    def mark_returned(self) -> None:
        self.__available = True

    @abstractmethod
    def display_info(self) -> str:
        """Kembalikan string deskriptif item. Harus diimplementasi subclass."""
        raise NotImplementedError

class Book(LibraryItem):
    """Representasi buku di perpustakaan."""
    def __init__(self, title: str, author: str, pages: int) -> None:
        super().__init__(title)
        self.author = author
        self.pages = pages

    def display_info(self) -> str:
        status = "Tersedia" if self.available else "Dipinjam"
        return f"[Book] #{self.id} '{self.title}' oleh {self.author}, {self.pages} hlm — {status}"

class Magazine(LibraryItem):
    """Representasi majalah di perpustakaan."""
    def __init__(self, title: str, issue: int, month: str) -> None:
        super().__init__(title)
        self.issue = issue
        self.month = month

    def display_info(self) -> str:
        status = "Tersedia" if self.available else "Dipinjam"
        return f"[Magazine] #{self.id} '{self.title}' edisi {self.issue} ({self.month}) — {status}"
