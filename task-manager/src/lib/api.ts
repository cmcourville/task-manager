import { Engineer, Task } from './types'

const API_BASE = '/api/data'

export interface DataStore {
  engineers: Engineer[]
  tasks: Task[]
}

export const dataApi = {
  // Read data from JSON file
  async getData(): Promise<DataStore> {
    const response = await fetch(API_BASE)
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    return response.json()
  },

  // Save data to JSON file
  async saveData(data: DataStore): Promise<boolean> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.ok
  },

  // Save engineers
  async saveEngineers(engineers: Engineer[], tasks: Task[]): Promise<boolean> {
    return this.saveData({ engineers, tasks })
  },

  // Save tasks
  async saveTasks(engineers: Engineer[], tasks: Task[]): Promise<boolean> {
    return this.saveData({ engineers, tasks })
  }
}
