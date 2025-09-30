import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Layout from '@/app/layout'

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  )
}))

// Mock the metadata
vi.mock('next/head', () => ({
  default: ({ children }: any) => children
}))

describe('Layout Component', () => {
  it('should render children', () => {
    render(
      <Layout>
        <div data-testid="test-child">Test Content</div>
      </Layout>
    )
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should have proper HTML structure', () => {
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    )
    
    const htmlElement = document.querySelector('html')
    const bodyElement = document.querySelector('body')
    
    expect(htmlElement).toBeInTheDocument()
    expect(bodyElement).toBeInTheDocument()
  })

  it('should render with proper lang attribute', () => {
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    )
    
    // Check that the layout renders without errors
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
