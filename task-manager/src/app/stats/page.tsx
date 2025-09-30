'use client'

import React from 'react'
import Link from 'next/link'
import { sampleEngineers, sampleTasks, calculateStatistics } from '@/lib/data'

export default function StatsPage() {
  const statistics = calculateStatistics(sampleEngineers, sampleTasks)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      {/* Navigation */}
      <nav className="nav">
        <Link href="/engineers" className="nav-btn">
          Engineers
        </Link>
        <Link href="/tasks" className="nav-btn">
          Tasks
        </Link>
        <Link href="/stats" className="nav-btn active">
          Statistics
        </Link>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <h1>Project Statistics</h1>
        </div>

        {/* KPI Cards */}
        <div className="statistics-grid">
          <div className="kpi-card">
            <div className="kpi-label">Total Tasks</div>
            <div className="kpi-value">{statistics.totalTasks}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Completed Tasks</div>
            <div className="kpi-value">{statistics.completedTasks}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Unassigned Tasks</div>
            <div className="kpi-value">{statistics.unassignedTasks}</div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="statistics-section">
          <h2 style={{ color: '#d63384', marginBottom: '20px' }}>Detailed Statistics</h2>
          
          <div className="statistics-grid">
            <div className="stat-card">
              <h4>Time Estimates</h4>
              <div className="stat-item">
                <span className="stat-label">Total Estimated Minutes</span>
                <span className="stat-value">{statistics.totalEstimatedMinutes}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Actual Minutes</span>
                <span className="stat-value">{statistics.totalActualMinutes}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Unassigned Estimated Minutes</span>
                <span className="stat-value">{statistics.unassignedEstimatedMinutes}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Completed Actual Minutes</span>
                <span className="stat-value">{statistics.completedActualMinutes}</span>
              </div>
            </div>

            <div className="stat-card">
              <h4>Engineer Workloads</h4>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                (Assigned but not completed tasks)
              </p>
              {Object.entries(statistics.engineerWorkloads).map(([engineerId, workload]) => (
                <div key={engineerId} className="stat-item">
                  <span className="stat-label">{workload.name}</span>
                  <span className="stat-value">{workload.minutes} min</span>
                </div>
              ))}
            </div>

            <div className="stat-card">
              <h4>Project Progress</h4>
              <div className="stat-item">
                <span className="stat-label">Completion Rate</span>
                <span className="stat-value">
                  {statistics.totalTasks > 0 
                    ? Math.round((statistics.completedTasks / statistics.totalTasks) * 100)
                    : 0}%
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Assignment Rate</span>
                <span className="stat-value">
                  {statistics.totalTasks > 0 
                    ? Math.round(((statistics.totalTasks - statistics.unassignedTasks) / statistics.totalTasks) * 100)
                    : 0}%
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Time Efficiency</span>
                <span className="stat-value">
                  {statistics.totalEstimatedMinutes > 0 
                    ? Math.round((statistics.totalActualMinutes / statistics.totalEstimatedMinutes) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
