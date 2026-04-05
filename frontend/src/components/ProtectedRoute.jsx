import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role, user } = useSelector((state) => state.auth)

  if (!isAuthenticated && !localStorage.getItem('access_token')) {
    return <Navigate to='/login' />
  }

  if (roles && role && !roles.includes(role)) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-red-500'>403</h1>
          <p className='text-gray-600 mt-2'>
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    )
  }

  return children
}