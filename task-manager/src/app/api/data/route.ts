import { NextRequest, NextResponse } from 'next/server'
import { Engineer, Task } from '@/lib/types'
import fs from 'fs'
import path from 'path'

const DATA_FILE_PATH = path.join(process.cwd(), 'src/lib/data.json')

export interface DataStore {
  engineers: Engineer[]
  tasks: Task[]
}

// GET - Read data
export async function GET() {
  try {
    const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf8')
    const data = JSON.parse(fileContent)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading data file:', error)
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 })
  }
}

// POST - Write data
export async function POST(request: NextRequest) {
  try {
    const data: DataStore = await request.json()
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error writing data file:', error)
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 })
  }
}
