import React, { useState } from 'react';
import Sidebar from './sidebar';

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
      {/* Mobile menu button */}
      <button 
        className="fixed top-4 left-4 z-40 md:hidden p-2 rounded bg-yellow-500 text-white"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar wrapper */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen
        transform transition-transform duration-300 ease-in-out z-30
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Progress Overview */}
            <div className="p-6 bg-white rounded-lg shadow-sm border border-yellow-400">
              <h3 className="text-indigo-900 mt-0">Overall Progress</h3>
              <div className="w-full h-3 bg-gray-200 rounded-full mt-4">
                <div className="w-3/4 h-full bg-yellow-400 rounded-full" />
              </div>
              <p className="text-gray-600 mt-2">75% Complete</p>
            </div>

            {/* Enrolled Courses */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-indigo-900 mt-0">Enrolled Courses</h3>
              <div className="space-y-4">
                {['Web Development', 'Data Structures', 'Machine Learning'].map((course, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-900">
                    {course}
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Tests */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-indigo-900 mt-0">Upcoming Tests</h3>
              {['DSA Mock Test - June 15', 'Web Dev Quiz - June 18'].map((test, index) => (
                <div key={index} className="p-3 my-2 bg-yellow-50 rounded-md text-yellow-800">
                  {test}
                </div>
              ))}
            </div>

            {/* Latest Notes */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-indigo-900 mt-0">Latest Notes</h3>
              <div className="space-y-3">
                {['JavaScript Basics', 'React Hooks', 'Node.js Fundamentals'].map((note, index) => (
                  <div key={index} className="p-3 bg-gray-200 rounded-md flex items-center gap-2">
                    <span className="text-gray-600">📝</span>
                    <div className='text-gray-500'>{note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="p-6 bg-white rounded-lg shadow-sm col-span-full">
              <h3 className="text-indigo-900 mt-0">Notifications</h3>
              <div className="space-y-3">
                {[
                  'New course material available for Web Development',
                  'Upcoming test reminder: DSA Mock Test',
                  'Your assignment has been graded'
                ].map((notification, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-md text-indigo-900">
                    {notification}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
