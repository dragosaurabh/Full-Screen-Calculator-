/**
 * Sample React component test
 * Verifies React Testing Library setup is working correctly
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CalculatorLayout } from './components/Layout/CalculatorLayout'

describe('App Component', () => {
  it('should render without crashing', () => {
    render(
      <MemoryRouter>
        <CalculatorLayout
          mode="basic"
          onModeChange={() => {}}
          sidebarOpen={true}
          onSidebarToggle={() => {}}
          historyOpen={true}
          onHistoryToggle={() => {}}
        />
      </MemoryRouter>
    )
    // The App component should render something
    expect(document.body).toBeDefined()
  })

  it('should render the calculator', () => {
    render(
      <MemoryRouter>
        <CalculatorLayout
          mode="basic"
          onModeChange={() => {}}
          sidebarOpen={true}
          onSidebarToggle={() => {}}
          historyOpen={true}
          onHistoryToggle={() => {}}
        />
      </MemoryRouter>
    )
    // Verify the calculator is rendered (expression input)
    const input = screen.getByRole('textbox', { name: /expression/i })
    expect(input).toBeInTheDocument()
  })
})
