import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  )
}))

describe('Home Page', () => {
  it('should render the main heading', () => {
    render(<Home />)
    
    expect(screen.getByText('TaskMaster')).toBeInTheDocument()
    expect(screen.getByText('Project Management System')).toBeInTheDocument()
  })

  it('should render navigation links', () => {
    render(<Home />)
    
    expect(screen.getByText('Engineers')).toBeInTheDocument()
    expect(screen.getByText('Tasks')).toBeInTheDocument()
    expect(screen.getByText('Statistics')).toBeInTheDocument()
  })

  it('should render welcome section', () => {
    render(<Home />)
    
    expect(screen.getByText('Welcome to TaskMaster')).toBeInTheDocument()
    expect(screen.getByText(/Manage your engineers and tasks efficiently/)).toBeInTheDocument()
  })

  it('should render action buttons', () => {
    render(<Home />)
    
    expect(screen.getByText('View Engineers')).toBeInTheDocument()
    expect(screen.getByText('View Tasks')).toBeInTheDocument()
    expect(screen.getByText('View Statistics')).toBeInTheDocument()
  })

  it('should have correct navigation links', () => {
    render(<Home />)
    
    const engineersLink = screen.getByText('Engineers').closest('a')
    const tasksLink = screen.getByText('Tasks').closest('a')
    const statsLink = screen.getByText('Statistics').closest('a')
    
    expect(engineersLink).toHaveAttribute('href', '/engineers')
    expect(tasksLink).toHaveAttribute('href', '/tasks')
    expect(statsLink).toHaveAttribute('href', '/stats')
  })

  it('should have correct action button links', () => {
    render(<Home />)
    
    const viewEngineersBtn = screen.getByText('View Engineers').closest('a')
    const viewTasksBtn = screen.getByText('View Tasks').closest('a')
    const viewStatsBtn = screen.getByText('View Statistics').closest('a')
    
    expect(viewEngineersBtn).toHaveAttribute('href', '/engineers')
    expect(viewTasksBtn).toHaveAttribute('href', '/tasks')
    expect(viewStatsBtn).toHaveAttribute('href', '/stats')
  })

  it('should have proper CSS classes', () => {
    render(<Home />)
    
    // Check that the main container exists
    const mainElement = screen.getByText('TaskMaster').closest('div')
    expect(mainElement).toBeInTheDocument()
  })

  it('should render all navigation buttons with correct styling', () => {
    render(<Home />)
    
    const navButtons = screen.getAllByRole('link')
    expect(navButtons).toHaveLength(6) // 3 nav + 3 action buttons
    
    // Check navigation buttons (first 3)
    const navLinks = navButtons.slice(0, 3)
    navLinks.forEach(button => {
      expect(button).toHaveClass('nav-btn')
    })
    
    // Check action buttons (last 3)
    const actionButtons = navButtons.slice(3, 6)
    actionButtons.forEach(button => {
      expect(button).toHaveClass('btn')
    })
  })
})
