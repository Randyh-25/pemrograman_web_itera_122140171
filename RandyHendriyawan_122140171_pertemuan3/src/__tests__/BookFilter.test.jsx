import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookFilter from '../components/BookFilter'

test('allows typing and selecting', async () => {
  const user = userEvent.setup()
  const onQueryChange = vi.fn()
  const onStatusChange = vi.fn()
  render(<BookFilter query="" status="semua" onQueryChange={onQueryChange} onStatusChange={onStatusChange} />)
  await user.type(screen.getByLabelText(/cari/i), 'abc')
  expect(onQueryChange).toHaveBeenCalled()
  await user.selectOptions(screen.getByLabelText(/filter-status/i), 'milik')
  expect(onStatusChange).toHaveBeenCalled()
})
