import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUsers,
  deleteUser,
  createUser,
  updateUser,
  clearUserMessages,
} from '../store/slices/userSlice'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

const ROLES = ['viewer', 'analyst', 'admin']

export default function Users() {
  const dispatch = useDispatch()
  const { list, loading, error, successMessage } = useSelector(
    (state) => state.users
  )

  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState({
    username: '', email: '', password: '', role: 'viewer'
  })

  useEffect(() => {
    dispatch(fetchUsers())
  }, [])

  // Auto clear messages after 3 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearUserMessages()), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, error])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id))
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setForm({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingUser) {
      const updateData = { role: form.role, email: form.email }
      await dispatch(updateUser({ id: editingUser.id, data: updateData }))
    } else {
      await dispatch(createUser(form))
    }
    setShowForm(false)
    setEditingUser(null)
    setForm({ username: '', email: '', password: '', role: 'viewer' })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingUser(null)
    setForm({ username: '', email: '', password: '', role: 'viewer' })
  }

  const roleBadge = (role) => {
    const styles = {
      admin: 'bg-red-100 text-red-600',
      analyst: 'bg-yellow-100 text-yellow-600',
      viewer: 'bg-green-100 text-green-600',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[role]}`}>
        {role.toUpperCase()}
      </span>
    )
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar />
      <div className='flex-1 flex flex-col overflow-auto'>
        <Navbar title='User Management' />

        <div className='p-6 space-y-4'>

          {/* Success / Error Messages */}
          {successMessage && (
            <div className='bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm'>
              ✅ {successMessage}
            </div>
          )}
          {error && (
            <div className='bg-red-100 text-red-600 px-4 py-3 rounded-lg text-sm'>
              ❌ {JSON.stringify(error)}
            </div>
          )}

          {/* Add User Button */}
          <div className='flex justify-end'>
            <button
              onClick={() => setShowForm(!showForm)}
              className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700'
            >
              + Add User
            </button>
          </div>

          {/* Create / Edit Form */}
          {showForm && (
            <div className='bg-white rounded-2xl shadow p-6'>
              <h3 className='font-semibold text-gray-700 mb-4'>
                {editingUser ? 'Edit User' : 'Create New User'}
              </h3>
              <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
                <input
                  type='text'
                  placeholder='Username'
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required={!editingUser}
                  disabled={!!editingUser}
                  className='border rounded-lg px-3 py-2 text-sm disabled:bg-gray-100'
                />
                <input
                  type='email'
                  placeholder='Email'
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className='border rounded-lg px-3 py-2 text-sm'
                />
                {!editingUser && (
                  <input
                    type='password'
                    placeholder='Password'
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className='border rounded-lg px-3 py-2 text-sm'
                  />
                )}
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className='border rounded-lg px-3 py-2 text-sm'
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r.toUpperCase()}</option>
                  ))}
                </select>

                <div className='col-span-2 flex gap-3'>
                  <button
                    type='submit'
                    className='bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 text-sm'
                  >
                    {editingUser ? 'Update User' : 'Create User'}
                  </button>
                  <button
                    type='button'
                    onClick={handleCancel}
                    className='bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 text-sm'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Users Table */}
          <div className='bg-white rounded-2xl shadow p-6'>
            {loading ? (
              <p className='text-gray-400 text-center py-8'>Loading users...</p>
            ) : (
              <table className='w-full text-sm'>
                <thead>
                  <tr className='text-left text-gray-500 border-b'>
                    <th className='pb-2'>Username</th>
                    <th className='pb-2'>Email</th>
                    <th className='pb-2'>Role</th>
                    <th className='pb-2'>Status</th>
                    <th className='pb-2'>Joined</th>
                    <th className='pb-2'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list?.map((user) => (
                    <tr key={user.id} className='border-b hover:bg-gray-50'>
                      <td className='py-2 font-medium'>{user.username}</td>
                      <td className='py-2 text-gray-500'>{user.email || '—'}</td>
                      <td className='py-2'>{roleBadge(user.role)}</td>
                      <td className='py-2'>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${user.is_active
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-500'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className='py-2 text-gray-400'>
                        {new Date(user.date_joined).toLocaleDateString()}
                      </td>
                      <td className='py-2 flex gap-3'>
                        <button
                          onClick={() => handleEdit(user)}
                          className='text-blue-500 hover:text-blue-700 text-xs font-semibold'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className='text-red-500 hover:text-red-700 text-xs font-semibold'
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}