import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookForm from '../components/BookForm'

test('validates empty fields', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  render(<BookForm onSubmit={onSubmit} />)
  await user.click(screen.getByRole('button', { name: /tambah buku/i }))
  expect(screen.getByRole('alert', { name: ''})).toBeInTheDocument()
})

test('submits with valid data', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  render(<BookForm onSubmit={onSubmit} />)
  await user.type(screen.getByLabelText(/judul/i), 'Buku A')
  await user.type(screen.getByLabelText(/penulis/i), 'Penulis A')
  await user.selectOptions(screen.getByLabelText(/status/i), 'milik')
  await user.click(screen.getByRole('button', { name: /tambah buku/i }))
  expect(onSubmit).toHaveBeenCalled()
})
