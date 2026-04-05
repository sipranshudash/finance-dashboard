import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerAPI } from '../api/auth'

const ROLES = ['viewer', 'analyst', 'admin']

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'viewer',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await registerAPI(form)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md'>

        {/* Logo */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-blue-600'>💰 FinDash</h1>
          <p className='text-gray-500 mt-1'>Create your account</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className='bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm text-center'>
            ✅ Account created! Redirecting to login...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className='bg-red-100 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm'>
            ❌ {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>

          {/* Username */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Username
            </label>
            <input
              type='text'
              name='username'
              value={form.username}
              onChange={handleChange}
              required
              placeholder='Enter username'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
            />
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder='Enter email (optional)'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
            />
          </div>

          {/* Password */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <input
              type='password'
              name='password'
              value={form.password}
              onChange={handleChange}
              required
              placeholder='Enter password'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
            />
          </div>

          {/* Role */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Role
            </label>
            <select
              name='role'
              value={form.role}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.toUpperCase()}
                </option>
              ))}
            </select>
            <p className='text-xs text-gray-400 mt-1'>
              💡 Viewer → read only &nbsp;|&nbsp; Analyst → analytics &nbsp;|&nbsp; Admin → full access
            </p>
          </div>

          {/* Submit */}
          <button
            type='submit'
            disabled={loading || success}
            className='w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-sm'
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        {/* Login Link */}
        <p className='text-center text-sm text-gray-500 mt-6'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600 font-semibold hover:underline'>
            Login here
          </Link>
        </p>

      </div>
    </div>
  )
}