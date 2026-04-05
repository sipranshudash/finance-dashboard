import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

const links = [
  { to: '/', label: '🏠 Dashboard', roles: ['viewer', 'analyst', 'admin'] },
  { to: '/transactions', label: '💳 Transactions', roles: ['viewer', 'analyst', 'admin'] },
  { to: '/analytics', label: '📊 Analytics', roles: ['analyst', 'admin'] },
  { to: '/users', label: '👥 Users', roles: ['admin'] },
]

export default function Sidebar() {
  const { role, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className='w-64 min-h-screen bg-gray-900 text-white flex flex-col'>

      {/* Logo */}
      <div className='p-6 border-b border-gray-700'>
        <h1 className='text-2xl font-bold text-blue-400'>💰 FinDash</h1>
        <p className='text-gray-400 text-sm mt-1'>Finance Dashboard</p>
      </div>

      {/* User info */}
      <div className='p-4 border-b border-gray-700'>
        <p className='text-sm font-semibold'>{user?.username}</p>
        <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block font-medium
          ${role === 'admin' ? 'bg-red-500' :
            role === 'analyst' ? 'bg-yellow-500' : 'bg-green-500'}`}>
          {role?.toUpperCase()}
        </span>
      </div>

      {/* Nav Links */}
      <nav className='flex-1 p-4 space-y-2'>
        {links
          .filter((link) => link.roles.includes(role))
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium transition
                ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
      </nav>

      {/* Logout */}
      <div className='p-4 border-t border-gray-700'>
        <button
          onClick={handleLogout}
          className='w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-lg transition'
        >
          🚪 Logout
        </button>
      </div>
    </div>
  )
}