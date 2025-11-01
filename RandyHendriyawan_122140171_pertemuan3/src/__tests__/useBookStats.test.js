import { renderHook } from '@testing-library/react'
import { useBookStats } from '../hooks/useBookStats'

test('counts books by status', () => {
  const books = [
    { id:'1', title:'A', author:'X', status:'milik' },
    { id:'2', title:'B', author:'Y', status:'baca' },
    { id:'3', title:'C', author:'Z', status:'beli' },
    { id:'4', title:'D', author:'Z', status:'beli' }
  ]
  const { result } = renderHook(() => useBookStats(books))
  expect(result.current.total).toBe(4)
  expect(result.current.milik).toBe(1)
  expect(result.current.baca).toBe(1)
  expect(result.current.beli).toBe(2)
})
