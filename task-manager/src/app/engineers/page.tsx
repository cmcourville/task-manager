'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sampleEngineers, sampleTasks, calculateStatistics } from '@/lib/data'
import { Engineer, Task } from '@/lib/types'

export default function EngineersPage() {
  const [engineers] = useState<Engineer[]>(sampleEngineers)
  const [tasks] = useState<Task[]>(sampleTasks)
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showEngineerModal, setShowEngineerModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [isEditingEngineer, setIsEditingEngineer] = useState(false)
  const [isEditingTask, setIsEditingTask] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

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
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
    setIsEditingTask(false)
  }

  const handleEditEngineer = () => {
    setIsEditingEngineer(true)
  }

  const handleEditTask = () => {
    setIsEditingTask(true)
  }

  const handleCancelEdit = () => {
    setIsEditingEngineer(false)
    setIsEditingTask(false)
  }

  const handleSaveEngineer = () => {
    setSuccessMessage('Engineer updated successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
    setIsEditingEngineer(false)
  }

  const handleSaveTask = () => {
    setSuccessMessage('Task updated successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
    setIsEditingTask(false)
  }

  const handleDeleteEngineer = () => {
    const assignedTasks = getTasksForEngineer(selectedEngineer!.id)
    if (assignedTasks.length > 0) {
      alert('Cannot delete engineer with assigned tasks!')
      return
    }
    setSuccessMessage('Engineer deleted successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
    setShowEngineerModal(false)
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

  const getTotalAssignedMinutes = (engineerId: string) => {
    const assignedTasks = getTasksForEngineer(engineerId)
    return assignedTasks.reduce((sum, task) => sum + task.estimatedTime, 0)
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
              <button className="dropdown-item">Add Engineer</button>
              <button className="dropdown-item">Add Task</button>
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
                <form>
                  <div className="form-group">
                    <label>Name:</label>
                    <input type="text" defaultValue={selectedEngineer.name} />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input type="email" defaultValue={selectedEngineer.email} />
                  </div>
                  <div className="form-group">
                    <label>Department:</label>
                    <input type="text" defaultValue={selectedEngineer.department} />
                  </div>
                </form>
              ) : (
                <div>
                  <p><strong>Name:</strong> {selectedEngineer.name}</p>
                  <p><strong>Email:</strong> {selectedEngineer.email}</p>
                  <p><strong>Department:</strong> {selectedEngineer.department}</p>
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
