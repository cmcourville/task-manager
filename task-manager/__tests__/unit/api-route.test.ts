import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/data/route'
import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

// Mock fs module
vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn()
}))

// Mock path module
vi.mock('path', () => ({
  join: vi.fn()
}))

const mockFs = vi.mocked(fs)
const mockPath = vi.mocked(path)

describe('API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPath.join.mockReturnValue('/mock/path/data.json')
  })

  describe('GET /api/data', () => {
    it('should return data successfully', async () => {
      const mockData = {
        engineers: [{ id: 'eng1', name: 'Alice' }],
        tasks: [{ id: 'task1', title: 'Test', description: 'Test', estimatedTime: 60, status: 'unassigned' }]
      }

      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockData))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockData)
      expect(mockFs.readFileSync).toHaveBeenCalledWith('/mock/path/data.json', 'utf8')
    })

    it('should handle file read errors', async () => {
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found')
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to read data' })
    })

    it('should handle JSON parse errors', async () => {
      mockFs.readFileSync.mockReturnValue('invalid json')

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to read data' })
    })
  })

  describe('POST /api/data', () => {
    it('should save data successfully', async () => {
      const mockData = {
        engineers: [{ id: 'eng1', name: 'Alice' }],
        tasks: [{ id: 'task1', title: 'Test', description: 'Test', estimatedTime: 60, status: 'unassigned' }]
      }

      const mockRequest = {
        json: () => Promise.resolve(mockData)
      } as NextRequest

      mockFs.writeFileSync.mockImplementation(() => {})

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ success: true })
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        '/mock/path/data.json',
        JSON.stringify(mockData, null, 2)
      )
    })

    it('should handle JSON parse errors', async () => {
      const mockRequest = {
        json: () => Promise.reject(new Error('Invalid JSON'))
      } as NextRequest

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to write data' })
    })

    it('should handle file write errors', async () => {
      const mockData = {
        engineers: [],
        tasks: []
      }

      const mockRequest = {
        json: () => Promise.resolve(mockData)
      } as NextRequest

      mockFs.writeFileSync.mockImplementation(() => {
        throw new Error('Write failed')
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to write data' })
    })
  })
})
