'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { sampleEngineers, sampleTasks } from '@/lib/data'
import { dataApi } from '@/lib/api'
import { Engineer, Task } from '@/lib/types'

export default function TasksPage() {
  const [engineers, setEngineers] = useState<Engineer[]>(sampleEngineers)
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [taskEdit, setTaskEdit] = useState<Task | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [isEditingTask, setIsEditingTask] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await dataApi.getData()
        setEngineers(data.engineers)
        setTasks(data.tasks)
      } catch (e) {
        console.error('Failed to load data for Tasks page', e)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setTaskEdit({ ...task })
    setShowTaskModal(true)
    setIsEditingTask(false)
  }

  const handleEditTask = () => {
    if (selectedTask) {
      setTaskEdit({ ...selectedTask })
    }
    setIsEditingTask(true)
  }

  const handleCancelEdit = () => {
    setIsEditingTask(false)
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
        <Link href="/engineers" className="nav-btn">
          Engineers
        </Link>
        <Link href="/tasks" className="nav-btn active">
          Tasks
        </Link>
        <Link href="/stats" className="nav-btn">
          Statistics
        </Link>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <h1>Task Management</h1>
          <div className="add-dropdown">
            <button className="add-task-btn" id="add-dropdown-btn">+</button>
            <div className="dropdown-menu">
              <button className="dropdown-item">Add Task</button>
            </div>
          </div>
        </div>

        {/* Task Columns */}
        <div className="task-columns">
          {/* Unassigned Tasks */}
          <div className="task-column">
            <h3>Unassigned Tasks</h3>
            {getTasksByStatus('unassigned').map((task) => (
              <div 
                key={task.id} 
                className="task-card"
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

          {/* Assigned Tasks */}
          <div className="task-column">
            <h3>Assigned Tasks</h3>
            {getTasksByStatus('assigned').map((task) => (
              <div 
                key={task.id} 
                className="task-card"
                onClick={() => handleTaskClick(task)}
              >
                <div className="task-title">{task.title}</div>
                <div className="task-id">ID: {task.id}</div>
                <div className="task-assignee">
                  Assigned to: {task.assigneeName}
                </div>
                <div className={`task-status ${task.status}`}>
                  {task.status}
                </div>
                <div className="task-time">{task.estimatedTime} min estimated</div>
              </div>
            ))}
          </div>

          {/* Completed Tasks */}
          <div className="task-column">
            <h3>Completed Tasks</h3>
            {getTasksByStatus('completed').map((task) => (
              <div 
                key={task.id} 
                className="task-card"
                onClick={() => handleTaskClick(task)}
              >
                <div className="task-title">{task.title}</div>
                <div className="task-id">ID: {task.id}</div>
                <div className="task-assignee">
                  Completed by: {task.assigneeName}
                </div>
                <div className={`task-status ${task.status}`}>
                  {task.status}
                </div>
                <div className="task-time">
                  {task.estimatedTime} min estimated
                  {task.actualTime && ` • ${task.actualTime} min actual`}
                </div>
              </div>
            ))}
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
                    <label>Actual Time (minutes):</label>
                    <input 
                      type="number" 
                      value={taskEdit?.actualTime || ''}
                      onChange={(e) => setTaskEdit(prev => prev ? { ...prev, actualTime: e.target.value ? Number(e.target.value) : undefined } : prev)}
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
                </form>
              ) : (
                <div>
                  <p><strong>Title:</strong> {selectedTask.title}</p>
                  <p><strong>Description:</strong> {selectedTask.description}</p>
                  <p><strong>Estimated Time:</strong> {selectedTask.estimatedTime} minutes</p>
                  {selectedTask.actualTime && (
                    <p><strong>Actual Time:</strong> {selectedTask.actualTime} minutes</p>
                  )}
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
