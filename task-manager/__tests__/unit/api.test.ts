import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { dataApi } from '@/lib/api'
import type { Engineer, Task } from '@/lib/types'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getData', () => {
    it('should fetch data successfully', async () => {
      const mockData = {
        engineers: [{ id: 'eng1', name: 'Alice' }],
        tasks: [{ id: 'task1', title: 'Test Task', description: 'Test', estimatedTime: 60, status: 'unassigned' }]
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      })

      const result = await dataApi.getData()

      expect(mockFetch).toHaveBeenCalledWith('/api/data')
      expect(result).toEqual(mockData)
    })

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(dataApi.getData()).rejects.toThrow('Failed to fetch data')
    })

    it('should throw error when network fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(dataApi.getData()).rejects.toThrow('Network error')
    })
  })

  describe('saveData', () => {
    it('should save data successfully', async () => {
      const mockData = {
        engineers: [{ id: 'eng1', name: 'Alice' }],
        tasks: [{ id: 'task1', title: 'Test Task', description: 'Test', estimatedTime: 60, status: 'unassigned' }]
      }

      mockFetch.mockResolvedValueOnce({
        ok: true
      })

      const result = await dataApi.saveData(mockData)

      expect(mockFetch).toHaveBeenCalledWith('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockData),
      })
      expect(result).toBe(true)
    })

    it('should return false when save fails', async () => {
      const mockData = {
        engineers: [],
        tasks: []
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      const result = await dataApi.saveData(mockData)

      expect(result).toBe(false)
    })

    it('should handle network errors', async () => {
      const mockData = {
        engineers: [],
        tasks: []
      }

      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(dataApi.saveData(mockData)).rejects.toThrow('Network error')
    })
  })

  describe('saveEngineers', () => {
    it('should call saveData with correct parameters', async () => {
      const engineers: Engineer[] = [{ id: 'eng1', name: 'Alice' }]
      const tasks: Task[] = [{ id: 'task1', title: 'Test', description: 'Test', estimatedTime: 60, status: 'unassigned' }]

      mockFetch.mockResolvedValueOnce({
        ok: true
      })

      const result = await dataApi.saveEngineers(engineers, tasks)

      expect(mockFetch).toHaveBeenCalledWith('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ engineers, tasks }),
      })
      expect(result).toBe(true)
    })
  })

  describe('saveTasks', () => {
    it('should call saveData with correct parameters', async () => {
      const engineers: Engineer[] = [{ id: 'eng1', name: 'Alice' }]
      const tasks: Task[] = [{ id: 'task1', title: 'Test', description: 'Test', estimatedTime: 60, status: 'unassigned' }]

      mockFetch.mockResolvedValueOnce({
        ok: true
      })

      const result = await dataApi.saveTasks(engineers, tasks)

      expect(mockFetch).toHaveBeenCalledWith('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ engineers, tasks }),
      })
      expect(result).toBe(true)
    })
  })
})
