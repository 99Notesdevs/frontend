import React from 'react';
import Sidebar from './sidebar';

const Dashboard = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                  <div key={index} className="p-3 bg-gray-50 rounded-md flex items-center gap-2">
                    <span className="text-gray-600">📝</span>
                    {note}
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
      </div>
    </div>
  );
};

export default Dashboard;
