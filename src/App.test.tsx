/**
 * Sample React component test
 * Verifies React Testing Library setup is working correctly
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />)
    // The App component should render something
    expect(document.body).toBeDefined()
  })

  it('should render the calculator', () => {
    render(<App />)
    // Verify the calculator is rendered (expression input)
    const input = screen.getByRole('textbox', { name: /expression/i })
    expect(input).toBeInTheDocument()
  })
})
