import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'

// Mock the blink module
vi.mock('@/lib/blink', () => ({
  blink: {
    auth: {
      me: vi.fn(() => Promise.resolve({ user: { id: 'test-user-id' } }))
    },
    db: {
      appointments: {
        list: vi.fn(() => Promise.resolve([])),
        count: vi.fn(() => Promise.resolve(0))
      },
      topics: {
        count: vi.fn(() => Promise.resolve(0))
      },
      goals: {
        count: vi.fn(() => Promise.resolve(0))
      },
      mood_logs: {
        list: vi.fn(() => Promise.resolve([]))
      }
    }
  }
}))

describe('HomePage', () => {
  it('renders the home page', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    
    // Add your test assertions here
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
})
