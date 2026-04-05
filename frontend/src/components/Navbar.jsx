import { useSelector } from 'react-redux'

export default function Navbar({ title }) {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className='bg-white shadow px-6 py-4 flex items-center justify-between'>
      <h2 className='text-xl font-bold text-gray-800'>{title}</h2>
      <p className='text-sm text-gray-500'>
        Welcome, <span className='font-semibold text-blue-600'>{user?.username}</span>
      </p>
    </div>
  )
}