'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [activeTab, setActiveTab] = useState('engineers')

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
        <Link href="/stats" className="nav-btn">
          Statistics
        </Link>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <h1>TaskMaster</h1>
          <p className="text-gray-600">Project Management System</p>
        </div>
        
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-pink-600 mb-4">Welcome to TaskMaster</h2>
          <p className="text-lg text-gray-600 mb-8">
            Manage your engineers and tasks efficiently with our modern project management system.
          </p>
          <div className="space-x-4">
            <Link href="/engineers" className="btn btn-primary">
              View Engineers
            </Link>
            <Link href="/tasks" className="btn btn-secondary">
              View Tasks
            </Link>
            <Link href="/stats" className="btn btn-secondary">
              View Statistics
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
