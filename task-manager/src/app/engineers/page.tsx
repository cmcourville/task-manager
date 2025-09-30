'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { sampleEngineers, sampleTasks, calculateStatistics } from '@/lib/data'
import { dataApi } from '@/lib/api'
import { Engineer, Task } from '@/lib/types'

export default function EngineersPage() {
  const [engineers, setEngineers] = useState<Engineer[]>(sampleEngineers)
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [taskEdit, setTaskEdit] = useState<Task | null>(null)
  const [showEngineerModal, setShowEngineerModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [isEditingEngineer, setIsEditingEngineer] = useState(false)
  const [isCreatingEngineer, setIsCreatingEngineer] = useState(false)
  const [isEditingTask, setIsEditingTask] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [engineerNameInput, setEngineerNameInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Load data from API on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await dataApi.getData()
        setEngineers(data.engineers)
        setTasks(data.tasks)
      } catch (error) {
        console.error('Failed to load data:', error)
        // Fall back to sample data if API fails
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const statistics = calculateStatistics(engineers, tasks)

  const getTasksForEngineer = (engineerId: string) => {
    return tasks.filter(task => task.assigneeId === engineerId)
  }

  const getUnassignedTasks = () => {
    return tasks.filter(task => task.status === 'unassigned')
  }

  const handleEngineerClick = (engineer: Engineer) => {
    setSelectedEngineer(engineer)
    setShowEngineerModal(true)
    setIsEditingEngineer(false)
    setIsCreatingEngineer(false)
    setEngineerNameInput(engineer.name)
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setTaskEdit({ ...task })
    setShowTaskModal(true)
    setIsEditingTask(false)
  }

  const handleEditEngineer = () => {
    setIsEditingEngineer(true)
    setIsCreatingEngineer(false)
  }

  const handleEditTask = () => {
    if (selectedTask) {
      setTaskEdit({ ...selectedTask })
    }
    setIsEditingTask(true)
  }

  const handleAddEngineer = () => {
    const emptyEngineer: Engineer = {
      id: '',
      name: ''
    }
    setSelectedEngineer(emptyEngineer)
    setIsEditingEngineer(true)
    setIsCreatingEngineer(true)
    setShowEngineerModal(true)
    setEngineerNameInput('')
  }

  const handleAddTask = () => {
    const emptyTask: Task = {
      id: '',
      title: '',
      description: '',
      estimatedTime: 0,
      status: 'unassigned'
    }
    setSelectedTask(emptyTask)
    setIsEditingTask(true)
    setShowTaskModal(true)
  }

  const handleCancelEdit = () => {
    setIsEditingEngineer(false)
    setIsEditingTask(false)
    setIsCreatingEngineer(false)
  }

  const handleSaveEngineer = async () => {
    if (!selectedEngineer) return
    let updatedEngineers: Engineer[]
    
    if (isCreatingEngineer) {
      const newEngineer: Engineer = {
        id: `eng${Date.now()}`,
        name: engineerNameInput.trim()
      }
      updatedEngineers = [...engineers, newEngineer]
      setEngineers(updatedEngineers)
      setSelectedEngineer(newEngineer)
      setSuccessMessage('Engineer added successfully!')
    } else {
      updatedEngineers = engineers.map(e => e.id === selectedEngineer.id ? { ...e, name: engineerNameInput.trim() } : e)
      setEngineers(updatedEngineers)
      setSelectedEngineer(prev => prev ? { ...prev, name: engineerNameInput.trim() } : prev)
      setSuccessMessage('Engineer updated successfully!')
    }
    
    // Save to JSON file
    try {
      await dataApi.saveEngineers(updatedEngineers, tasks)
    } catch (error) {
      console.error('Failed to save engineer:', error)
      setSuccessMessage('Engineer saved locally, but failed to persist to file')
    }
    
    setTimeout(() => setSuccessMessage(''), 3000)
    setIsEditingEngineer(false)
    setIsCreatingEngineer(false)
  }

  const handleSaveTask = async () => {
    if (!selectedTask || !taskEdit) return
    
    // Auto-determine status based on assignee
    const hasAssignee = taskEdit.assigneeId && taskEdit.assigneeId.trim() !== ''
    const autoStatus = hasAssignee ? 'assigned' : 'unassigned'
    
    // Only allow status changes from 'assigned' to 'completed'
    // If task was 'assigned' and user wants 'completed', allow it
    // Otherwise, use auto-determined status
    const finalStatus = (selectedTask.status === 'assigned' && taskEdit.status === 'completed') 
      ? 'completed' 
      : autoStatus
    
    // Validation: If status is 'completed', actual time must be provided
    if (finalStatus === 'completed' && (!taskEdit.actualTime || taskEdit.actualTime <= 0)) {
      alert('Please provide the actual time spent to mark this task as completed.')
      return
    }
    
    const updatedTask: Task = {
      ...taskEdit,
      status: finalStatus as Task['status']
    }
    
    // Persist edits to tasks state
    const updatedTasks = tasks.map(t => t.id === selectedTask.id ? { ...t, ...updatedTask } : t)
    setTasks(updatedTasks)
    setSelectedTask(updatedTask)
    
    // Save to JSON file
    try {
      await dataApi.saveTasks(engineers, updatedTasks)
      setSuccessMessage('Task updated successfully!')
    } catch (error) {
      console.error('Failed to save task:', error)
      setSuccessMessage('Task saved locally, but failed to persist to file')
    }
    
    setTimeout(() => setSuccessMessage(''), 3000)
    setIsEditingTask(false)
  }

  const handleDeleteEngineer = async () => {
    const assignedTasks = getTasksForEngineer(selectedEngineer!.id)
    if (assignedTasks.length > 0) {
      alert('Cannot delete engineer with assigned tasks!')
      return
    }
    
    const updatedEngineers = engineers.filter(e => e.id !== selectedEngineer!.id)
    setEngineers(updatedEngineers)
    
    // Save to JSON file
    try {
      await dataApi.saveEngineers(updatedEngineers, tasks)
      setSuccessMessage('Engineer deleted successfully!')
    } catch (error) {
      console.error('Failed to save after delete:', error)
      setSuccessMessage('Engineer deleted locally, but failed to persist to file')
    }
    
    setTimeout(() => setSuccessMessage(''), 3000)
    setShowEngineerModal(false)
  }

  const handleDeleteTask = async () => {
    if (selectedTask!.assigneeId) {
      alert('Cannot delete assigned task!')
      return
    }
    
    const updatedTasks = tasks.filter(t => t.id !== selectedTask!.id)
    setTasks(updatedTasks)
    
    // Save to JSON file
    try {
      await dataApi.saveTasks(engineers, updatedTasks)
      setSuccessMessage('Task deleted successfully!')
    } catch (error) {
      console.error('Failed to save after delete:', error)
      setSuccessMessage('Task deleted locally, but failed to persist to file')
    }
    
    setTimeout(() => setSuccessMessage(''), 3000)
    setShowTaskModal(false)
  }

  const getTotalAssignedMinutes = (engineerId: string) => {
    const assignedTasks = getTasksForEngineer(engineerId)
    return assignedTasks.reduce((sum, task) => sum + task.estimatedTime, 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      {/* Navigation */}
      <nav className="nav">
        <Link href="/engineers" className="nav-btn active">
          Engineers
        </Link>
        <Link href="/tasks" className="nav-btn">
          Tasks
        </Link>
        <Link href="/stats" className="nav-btn">
          Statistics
        </Link>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <h1>Engineers & Assigned Tasks</h1>
          <div className="add-dropdown">
            <button className="add-task-btn" id="add-dropdown-btn">+</button>
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleAddEngineer}>Add Engineer</button>
              <button className="dropdown-item" onClick={handleAddTask}>Add Task</button>
            </div>
          </div>
        </div>

        {/* Engineers Table */}
      <div className="engineers-tasks-table">
          <div className="table-header">
            <div className="table-header-cell">Engineer</div>
            <div className="table-header-cell">Assigned Tasks</div>
          </div>
          
          {engineers.map((engineer) => {
            const assignedTasks = getTasksForEngineer(engineer.id)
            return (
              <div key={engineer.id} className="engineer-row">
                <div 
                  className="engineer-cell" 
                  onClick={() => handleEngineerClick(engineer)}
                >
                  <div className="engineer-name">{engineer.name}</div>
                  <div className="engineer-id">ID: {engineer.id}</div>
                  <div className="engineer-tasks-count">
                    {assignedTasks.length} assigned tasks
                  </div>
                </div>
                <div className="tasks-cell">
                  {assignedTasks.length > 0 ? (
                    <div className="engineer-tasks-group">
                      <div className="engineer-tasks-header">
                        Tasks assigned to {engineer.name}
                      </div>
                      {assignedTasks.map((task) => (
                        <div 
                          key={task.id} 
                          className="task-item"
                          onClick={() => handleTaskClick(task)}
                        >
                          <div className="task-title">{task.title}</div>
                          <div className="task-id">ID: {task.id}</div>
                          <div className="task-assignee">
                            {task.status === 'completed' ? 'Completed by' : 'Assigned to'}: {engineer.name}
                          </div>
                          <div className={`task-status ${task.status}`}>
                            {task.status}
                          </div>
                          <div className="task-time">{task.estimatedTime} min estimated</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="engineer-tasks-group">
                      <div className="engineer-tasks-header">No tasks assigned</div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          
          {/* Unassigned Tasks */}
          <div className="engineer-row">
            <div className="engineer-cell unassigned">
              <div className="engineer-name">Unassigned Tasks</div>
              <div className="engineer-tasks-count">
                {getUnassignedTasks().length} unassigned tasks
              </div>
            </div>
            <div className="tasks-cell">
              <div className="engineer-tasks-group unassigned-tasks">
                <div className="engineer-tasks-header">Unassigned Tasks</div>
                {getUnassignedTasks().map((task) => (
                  <div 
                    key={task.id} 
                    className="task-item"
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="task-title">{task.title}</div>
                    <div className="task-id">ID: {task.id}</div>
                    <div className="task-assignee">Not assigned</div>
                    <div className={`task-status ${task.status}`}>
                      {task.status}
                    </div>
                    <div className="task-time">{task.estimatedTime} min estimated</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message show">
            {successMessage}
            <button 
              className="close-success"
              onClick={() => setSuccessMessage('')}
            >
              ×
            </button>
          </div>
        )}
      </main>

      {/* Engineer Modal */}
      {showEngineerModal && selectedEngineer && (
        <div className="modal show">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Engineer Details</h2>
              <div className="modal-header-actions">
                {!isEditingEngineer ? (
                  <button 
                    className="btn btn-primary"
                    onClick={handleEditEngineer}
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button 
                      className="btn btn-secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={handleSaveEngineer}
                    >
                      Save Changes
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={handleDeleteEngineer}
                      disabled={getTasksForEngineer(selectedEngineer.id).length > 0}
                    >
                      Delete
                    </button>
                  </>
                )}
                <button 
                  className="close"
                  onClick={() => setShowEngineerModal(false)}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="modal-body">
              {isEditingEngineer ? (
                <form onSubmit={(e) => { e.preventDefault(); handleSaveEngineer() }}>
                  <div className="form-group">
                    <label>Name:</label>
                    <input 
                      type="text" 
                      value={engineerNameInput} 
                      onChange={(e) => setEngineerNameInput(e.target.value)}
                    />
                  </div>
                </form>
              ) : (
                <div>
                  <p><strong>Name:</strong> {selectedEngineer.name}</p>
                  <p><strong>Total Assigned Minutes:</strong> {getTotalAssignedMinutes(selectedEngineer.id)} minutes</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && selectedTask && (
        <div className="modal show">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Task Details</h2>
              <div className="modal-header-actions">
                {!isEditingTask ? (
                  <button 
                    className="btn btn-primary"
                    onClick={handleEditTask}
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button 
                      className="btn btn-secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={handleSaveTask}
                    >
                      Save Changes
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={handleDeleteTask}
                      disabled={!!selectedTask.assigneeId}
                    >
                      Delete
                    </button>
                  </>
                )}
                <button 
                  className="close"
                  onClick={() => setShowTaskModal(false)}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="modal-body">
              {isEditingTask ? (
                <form onSubmit={(e) => { e.preventDefault(); handleSaveTask() }}>
                  <div className="form-group">
                    <label>Title:</label>
                    <input 
                      type="text" 
                      value={taskEdit?.title || ''}
                      onChange={(e) => setTaskEdit(prev => prev ? { ...prev, title: e.target.value } : prev)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <textarea 
                      value={taskEdit?.description || ''}
                      onChange={(e) => setTaskEdit(prev => prev ? { ...prev, description: e.target.value } : prev)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Estimated Time (minutes):</label>
                    <input 
                      type="number" 
                      value={taskEdit?.estimatedTime ?? 0}
                      onChange={(e) => setTaskEdit(prev => prev ? { ...prev, estimatedTime: Number(e.target.value) } : prev)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status:</label>
                    <select 
                      value={taskEdit?.status || 'unassigned'}
                      onChange={(e) => setTaskEdit(prev => prev ? { ...prev, status: e.target.value as Task['status'] } : prev)}
                      disabled={taskEdit?.status === 'unassigned'}
                    >
                      <option value="unassigned">Unassigned (Auto)</option>
                      <option value="assigned">Assigned (Auto)</option>
                      <option value="completed">Completed</option>
                    </select>
                    {taskEdit?.status === 'unassigned' && (
                      <small className="text-muted">Status will be 'Unassigned' when no engineer is assigned</small>
                    )}
                    {taskEdit?.status === 'assigned' && (
                      <small className="text-muted">Status will be 'Assigned' when engineer is assigned. Can change to 'Completed'</small>
                    )}
                    {taskEdit?.status === 'completed' && (
                      <small className="text-muted">Task is completed</small>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Assigned Engineer:</label>
                    <select 
                      value={taskEdit?.assigneeId || ''}
                      onChange={(e) => {
                        const newAssigneeId = e.target.value || undefined
                        const newAssigneeName = newAssigneeId ? (engineers.find(e => e.id === newAssigneeId)?.name) : undefined
                        const hasAssignee = newAssigneeId && newAssigneeId.trim() !== ''
                        const newStatus = hasAssignee ? 'assigned' : 'unassigned'
                        setTaskEdit(prev => prev ? { 
                          ...prev, 
                          assigneeId: newAssigneeId, 
                          assigneeName: newAssigneeName,
                          status: newStatus
                        } : prev)
                      }}
                    >
                      <option value="">Not assigned</option>
                      {engineers.map(eng => (
                        <option key={eng.id} value={eng.id}>{eng.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Actual Time (minutes):</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={taskEdit?.actualTime ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                        const numValue = value === '' ? undefined : Math.max(0, Number(value))
                        setTaskEdit(prev => prev ? { ...prev, actualTime: numValue } : prev)
                      }}
                      placeholder="Enter actual time spent"
                    />
                    <small className="text-muted">Enter a positive number for actual time spent</small>
                  </div>
                </form>
              ) : (
                <div>
                  <p><strong>Title:</strong> {selectedTask.title}</p>
                  <p><strong>Description:</strong> {selectedTask.description}</p>
                  <p><strong>Estimated Time:</strong> {selectedTask.estimatedTime} minutes</p>
                  <p><strong>Actual Time:</strong> {selectedTask.actualTime ? `${selectedTask.actualTime} minutes` : 'Not recorded'}</p>
                  <p><strong>Status:</strong> {selectedTask.status}</p>
                  <p><strong>Assigned to:</strong> {selectedTask.assigneeName || 'Not assigned'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
