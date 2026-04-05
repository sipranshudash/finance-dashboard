import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadUser } from './store/slices/authSlice'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Analytics from './pages/Analytics'
import Users from './pages/Users'
import Register from './pages/Register' 

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      dispatch(loadUser())
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path='/transactions' element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        } />
        <Route path='/analytics' element={
          <ProtectedRoute roles={['analyst', 'admin']}>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path='/users' element={
          <ProtectedRoute roles={['admin']}>
            <Users />
          </ProtectedRoute>
        } />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  )
}