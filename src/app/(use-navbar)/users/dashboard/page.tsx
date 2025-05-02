"use client";
import React, { useState } from 'react';
import Sidebar from '../layout/sidebar';
import ProtectedRoute from '@/components/ProtectedRoute'

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  return (
    <ProtectedRoute>
      <div className="flex flex-col md:flex-row bg-gradient-to-br from-[var(--bg-main)] to-yellow-50 min-h-screen">
        {/* Mobile menu button */}
        <button 
          className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-gradient-to-r from-yellow-400 to-[var(--primary)] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          onClick={() => setSidebarOpen(true)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Sidebar wrapper */}
        <div className={`
          fixed inset-y-0 left-0 transform md:relative md:translate-x-0
          transition duration-300 ease-in-out z-50
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}>
          <Sidebar 
            isMobileOpen={isSidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Message */}
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-900 to-yellow-600 bg-clip-text text-transparent">Welcome back, Student!</h1>
              <p className="text-[var(--text-tertiary)] mt-2 text-lg">Here&apos;s your learning overview.</p>
            </div>

            {/* Quick Access Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { title: 'My Courses', icon: '📚', color: 'from-blue-500 to-blue-600' },
                { title: 'Study Materials', icon: '📖', color: 'from-green-500 to-green-600' },
                { title: 'Assignments', icon: '✍️', color: 'from-yellow-500 to-yellow-600' },
                { title: 'Quizzes', icon: '📝', color: 'from-purple-500 to-purple-600' }
              ].map((item, index) => (
                <button 
                  key={index} 
                  className="p-6 rounded-xl bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className={`text-3xl mb-3 bg-gradient-to-r ${item.color} text-transparent bg-clip-text group-hover:scale-110 transition-transform duration-300`}>{item.icon}</div>
                  <div className="text-sm font-semibold text-[var(--text-strong)]">{item.title}</div>
                </button>
              ))}
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Recent Activity */}
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-2xl font-bold text-indigo-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {[
                    'Completed Chapter 3 in Web Development',
                    'Submitted Assignment: Data Structures',
                    'Attended Live Session: React Fundamentals'
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-200">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
                      <p className="text-[var(--text-strong)]">{activity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Overview */}
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-2xl font-bold text-indigo-900 mb-6">Performance Overview</h2>
                <div className="space-y-4">
                  {[
                    { course: 'Web Development', progress: 75 },
                    { course: 'Data Structures', progress: 60 },
                    { course: 'Machine Learning', progress: 45 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-tertiary)]">{item.course}</span>
                        <span className="text-indigo-600">{item.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-[var(--text-disabled)] rounded-full">
                        <div 
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Calendar & Announcements */}
            <div className="grid gap-8 md:grid-cols-2">
              {/* Calendar */}
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-2xl font-bold text-indigo-900 mb-6">Upcoming Events</h2>
                <div className="space-y-4">
                  {[
                    { date: 'June 15', event: 'DSA Mock Test', type: 'test' },
                    { date: 'June 16', event: 'Web Development Workshop', type: 'workshop' },
                    { date: 'June 18', event: 'Assignment Deadline', type: 'deadline' }
                  ].map((event, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-200">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-indigo-600">{event.date}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.event}</div>
                        <div className="text-xs text-gray-500 capitalize">{event.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Announcements */}
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-2xl font-bold text-indigo-900 mb-6">Announcements</h2>
                <div className="space-y-4">
                  {[
                    'New course material available for Web Development',
                    'Maintenance scheduled for this weekend',
                    'Rate your recent learning experience'
                  ].map((announcement, index) => (
                    <div key={index} className="p-4 bg-yellow-50 rounded-xl text-[var(--text-strong)] text-sm hover:bg-yellow-100 transition-colors duration-200">
                      {announcement}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-600/30 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
