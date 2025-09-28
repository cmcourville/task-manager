'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sampleEngineers, sampleTasks } from '@/lib/data'
import { Task } from '@/lib/types'

export default function TasksPage() {
  const [engineers] = useState(sampleEngineers)
  const [tasks] = useState<Task[]>(sampleTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [isEditingTask, setIsEditingTask] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
    setIsEditingTask(false)
  }

  const handleEditTask = () => {
    setIsEditingTask(true)
  }

  const handleCancelEdit = () => {
    setIsEditingTask(false)
  }

  const handleSaveTask = () => {
    setSuccessMessage('Task updated successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
    setIsEditingTask(false)
  }

  const handleDeleteTask = () => {
    if (selectedTask!.assigneeId) {
      alert('Cannot delete assigned task!')
      return
    }
    setSuccessMessage('Task deleted successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
    setShowTaskModal(false)
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
                <form>
                  <div className="form-group">
                    <label>Title:</label>
                    <input type="text" defaultValue={selectedTask.title} />
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <textarea defaultValue={selectedTask.description} />
                  </div>
                  <div className="form-group">
                    <label>Estimated Time (minutes):</label>
                    <input type="number" defaultValue={selectedTask.estimatedTime} />
                  </div>
                  <div className="form-group">
                    <label>Actual Time (minutes):</label>
                    <input type="number" defaultValue={selectedTask.actualTime || ''} />
                  </div>
                  <div className="form-group">
                    <label>Status:</label>
                    <select defaultValue={selectedTask.status}>
                      <option value="unassigned">Unassigned</option>
                      <option value="assigned">Assigned</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Assigned Engineer:</label>
                    <select 
                      defaultValue={selectedTask.assigneeId || ''}
                      disabled={!!selectedTask.assigneeId}
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
