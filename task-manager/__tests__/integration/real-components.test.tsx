import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EngineersPage from '@/app/engineers/page'
import TasksPage from '@/app/tasks/page'
import StatsPage from '@/app/stats/page'

// Mock the API
const mockDataApi = {
  getData: vi.fn(),
  saveEngineers: vi.fn(),
  saveTasks: vi.fn()
}

vi.mock('@/lib/api', () => ({
  dataApi: mockDataApi
}))

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  )
}))

describe('Real Component Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDataApi.getData.mockResolvedValue({
      engineers: [
        { id: 'eng1', name: 'Alice Johnson' },
        { id: 'eng2', name: 'Bob Smith' }
      ],
      tasks: [
        { id: 'task1', title: 'Test Task', description: 'Test', estimatedTime: 60, status: 'unassigned' },
        { id: 'task2', title: 'Assigned Task', description: 'Test', estimatedTime: 90, status: 'assigned', assigneeId: 'eng1', assigneeName: 'Alice Johnson' }
      ]
    })
    mockDataApi.saveEngineers.mockResolvedValue(true)
    mockDataApi.saveTasks.mockResolvedValue(true)
  })

  describe('Engineers Page', () => {
    it('should render engineers page with data', async () => {
      render(<EngineersPage />)
      
      await waitFor(() => {
        expect(screen.getByText('Engineers')).toBeInTheDocument()
      })
    })

    it('should show loading state initially', () => {
      render(<EngineersPage />)
      
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should load data on mount', async () => {
      render(<EngineersPage />)
      
      await waitFor(() => {
        expect(mockDataApi.getData).toHaveBeenCalled()
      })
    })

    it('should render engineers after data loads', async () => {
      render(<EngineersPage />)
      
      await waitFor(() => {
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
        expect(screen.getByText('Bob Smith')).toBeInTheDocument()
      })
    })
  })

  describe('Tasks Page', () => {
    it('should render tasks page with data', async () => {
      render(<TasksPage />)
      
      await waitFor(() => {
        expect(screen.getByText('Tasks')).toBeInTheDocument()
      })
    })

    it('should show loading state initially', () => {
      render(<TasksPage />)
      
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should load data on mount', async () => {
      render(<TasksPage />)
      
      await waitFor(() => {
        expect(mockDataApi.getData).toHaveBeenCalled()
      })
    })

    it('should render tasks after data loads', async () => {
      render(<TasksPage />)
      
      await waitFor(() => {
        expect(screen.getByText('Test Task')).toBeInTheDocument()
        expect(screen.getByText('Assigned Task')).toBeInTheDocument()
      })
    })
  })

  describe('Stats Page', () => {
    it('should render stats page with data', async () => {
      render(<StatsPage />)
      
      await waitFor(() => {
        expect(screen.getByText('Statistics')).toBeInTheDocument()
      })
    })

    it('should show loading state initially', () => {
      render(<StatsPage />)
      
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should load data on mount', async () => {
      render(<StatsPage />)
      
      await waitFor(() => {
        expect(mockDataApi.getData).toHaveBeenCalled()
      })
    })

    it('should render statistics after data loads', async () => {
      render(<StatsPage />)
      
      await waitFor(() => {
        expect(screen.getByText('Total Tasks')).toBeInTheDocument()
        expect(screen.getByText('Completed Tasks')).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors in Engineers page', async () => {
      mockDataApi.getData.mockRejectedValueOnce(new Error('API Error'))
      
      render(<EngineersPage />)
      
      await waitFor(() => {
        expect(screen.getByText('Engineers')).toBeInTheDocument()
      })
    })

    it('should handle API errors in Tasks page', async () => {
      mockDataApi.getData.mockRejectedValueOnce(new Error('API Error'))
      
      render(<TasksPage />)
      
      await waitFor(() => {
        expect(screen.getByText('Tasks')).toBeInTheDocument()
      })
    })

    it('should handle API errors in Stats page', async () => {
      mockDataApi.getData.mockRejectedValueOnce(new Error('API Error'))
      
      render(<StatsPage />)
      
      await waitFor(() => {
        expect(screen.getByText('Statistics')).toBeInTheDocument()
      })
    })
  })
})
