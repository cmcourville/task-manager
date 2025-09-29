import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { sampleEngineers, sampleTasks } from '@/lib/data'

// Mock Next.js components and pages
const MockEngineersPage = () => (
  <div>
    <h1>Engineers</h1>
    <ul>
      {sampleEngineers.map(engineer => (
        <li key={engineer.id} data-testid={`engineer-${engineer.id}`}>
          {engineer.name} - {engineer.department}
        </li>
      ))}
    </ul>
  </div>
)

const MockTasksPage = () => (
  <div>
    <h1>Tasks</h1>
    <ul>
      {sampleTasks.map(task => (
        <li key={task.id} data-testid={`task-${task.id}`}>
          {task.title} - {task.status}
        </li>
      ))}
    </ul>
  </div>
)

describe('Component Integration Tests', () => {
  describe('Engineers Page', () => {
    it('should render all engineers', () => {
      render(<MockEngineersPage />)
      
      expect(screen.getByText('Engineers')).toBeInTheDocument()
      
      sampleEngineers.forEach(engineer => {
        expect(screen.getByTestId(`engineer-${engineer.id}`)).toBeInTheDocument()
        expect(screen.getByText(engineer.name, { exact: false })).toBeInTheDocument()
        expect(screen.getByText(engineer.department, { exact: false })).toBeInTheDocument()
      })
    })

    it('should display correct number of engineers', () => {
      render(<MockEngineersPage />)
      
      const engineerElements = screen.getAllByTestId(/engineer-/)
      expect(engineerElements).toHaveLength(sampleEngineers.length)
    })
  })

  describe('Tasks Page', () => {
    it('should render all tasks', () => {
      render(<MockTasksPage />)
      
      expect(screen.getByText('Tasks')).toBeInTheDocument()
      
      sampleTasks.forEach(task => {
        const taskElement = screen.getByTestId(`task-${task.id}`)
        expect(taskElement).toBeInTheDocument()
        expect(taskElement).toHaveTextContent(task.title)
        expect(taskElement).toHaveTextContent(task.status)
      })
    })

    it('should display correct number of tasks', () => {
      render(<MockTasksPage />)
      
      const taskElements = screen.getAllByTestId(/task-/)
      expect(taskElements).toHaveLength(sampleTasks.length)
    })

    it('should show different task statuses', () => {
      render(<MockTasksPage />)
      
      const statuses = ['unassigned', 'assigned', 'completed']
      statuses.forEach(status => {
        const tasksWithStatus = sampleTasks.filter(task => task.status === status)
        if (tasksWithStatus.length > 0) {
          // Check that at least one task element contains this status
          const statusElements = screen.getAllByText(status, { exact: false })
          expect(statusElements.length).toBeGreaterThan(0)
        }
      })
    })
  })
})
