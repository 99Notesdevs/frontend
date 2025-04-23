"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { env } from '@/config/env';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaExclamationTriangle } from 'react-icons/fa';
import Cookies from 'js-cookie';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

interface Employee {
  id: string;
  name?: string; // Only for authors
  email: string;
  role: 'editor' | 'author';
  createdAt: string;
}

export default function ManageEmployees() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newEmployee, setNewEmployee] = useState<{
    id?: string;
    name?: string;
    email: string;
    role: "editor" | "author";
    password: string;
  }>({
    id: '',
    name: "",
    email: "",
    role: "editor",
    password: "",
  });

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [showEditPassword, setShowEditPassword] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No token found');
      }

      const [editorsResponse, authorsResponse] = await Promise.all([
        fetch(`${env.API}/editor`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch(`${env.API}/author`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      ]);

      if (!editorsResponse.ok || !authorsResponse.ok) {
        throw new Error('Failed to fetch employees');
      }

      const [editorsData, authorsData] = await Promise.all([
        editorsResponse.json(),
        authorsResponse.json()
      ]);

      // Transform the data to match our Employee interface
      const editors = editorsData.data.map((editor: any) => ({
        id: editor.id.toString(),
        email: editor.email,
        role: 'editor',
        createdAt: editor.createdAt
      }));

      const authors = authorsData.data.map((author: any) => ({
        id: author.id.toString(),
        name: author.name,
        email: author.email,
        role: 'author',
        createdAt: author.createdAt
      }));

      setEmployees([...editors, ...authors]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to load employees');
      setLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${env.API}/${newEmployee.role === 'editor' ? 'editor' : 'author'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) {
        throw new Error('Failed to add employee');
      }

      setShowAddForm(false);
      setNewEmployee({
        id: '',
        name: "",
        email: "",
        role: "editor",
        password: "",
      });
      fetchEmployees();
    } catch (error) {
      setError('Failed to add employee');
    }
  };

  const handleUpdateEmployee = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!editingEmployee) return;

    const updatedEmployee = {
      ...newEmployee,
      id: editingEmployee.id,
      role: editingEmployee.role
    };

    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(`${env.API}/${updatedEmployee.role === 'editor' ? 'editor' : 'author'}/${updatedEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedEmployee),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee');
      }

      // Update the form state with the new data
      setNewEmployee({
        id: '',
        name: "",
        email: "",
        role: "editor",
        password: ""
      });

      setEditingEmployee(null);
      fetchEmployees();
      setShowAddForm(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleDeleteEmployee = async (id: string, role: 'editor' | 'author') => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${env.API}/${role}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      fetchEmployees();
    } catch (error) {
      setError('Failed to delete employee');
    }
  };

  const handleEditEmployee = async (updatedEmployee: Employee) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${env.API}/${updatedEmployee.role === 'editor' ? 'editor' : 'author'}/${updatedEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedEmployee),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee');
      }

      // Update the form state with the new data
      setNewEmployee({
        ...updatedEmployee,
        password: '' // Clear password field
      });

      setEditingEmployee(null);
      fetchEmployees();
    } catch (error) {
      setError('Failed to update employee');
    }
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setNewEmployee({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      password: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteEmployeeId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteEmployee = async () => {
    if (!deleteEmployeeId) return;
    await handleDeleteEmployee(deleteEmployeeId, 'editor');
    setShowDeleteModal(false);
    setDeleteEmployeeId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`${plusJakarta.className} text-2xl font-bold`}>Manage Employees</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
        >
          <FaPlus /> Add Employee
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-center p-4 mb-6">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value as 'editor' | 'author' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="editor">Editor</option>
                  <option value="author">Author</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddEmployee}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
              >
                Add Employee
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Editors</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {employees
                .filter((e) => e.role === 'editor')
                .map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{employee.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {new Date(employee.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(employee)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(employee.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 mt-6">
          <h2 className="text-lg font-semibold mb-4">Authors</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {employees
                .filter((e) => e.role === 'author')
                .map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{employee.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{employee.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {new Date(employee.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(employee)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(employee.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-10 max-w-md w-full relative shadow-lg">
            <button
              onClick={handleCancelEdit}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-6">Edit Employee</h2>
            <form onSubmit={handleUpdateEmployee}>
              {editingEmployee.role === 'author' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="w-full border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="w-full border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showEditPassword ? "text" : "password"}
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    className="w-full border-0 border-b-2 border-slate-300 bg-transparent focus:outline-none focus:ring-0 focus:border-slate-500 transition-colors pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    onClick={() => setShowEditPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showEditPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-white text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full relative">
            <div className="flex flex-col items-center">
              <FaExclamationTriangle className="text-yellow-500 text-4xl mb-3" />
              <h2 className="text-lg font-bold text-slate-800 mb-2">Confirm Deletion</h2>
              <p className="text-slate-600 mb-6 text-center">Are you sure you want to delete this employee? This action cannot be undone.</p>
              <div className="flex gap-4 w-full justify-center">
                <button
                  className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold"
                  onClick={confirmDeleteEmployee}
                >
                  Delete
                </button>
                <button
                  className="px-4 py-2 rounded bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}