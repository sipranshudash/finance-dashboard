import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboard } from '../store/slices/dashboardSlice'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts'

const COLORS = ['#6366f1','#f59e0b','#10b981','#ef4444','#3b82f6','#ec4899','#14b8a6','#f97316']

export default function Analytics() {
  const dispatch = useDispatch()
  const { expense_by_category, monthly_trends, loading } = useSelector(
    (state) => state.dashboard
  )

  useEffect(() => {
    dispatch(fetchDashboard())
  }, [])

  const lineData = monthly_trends?.income?.map((item) => {
    const match = monthly_trends.expense?.find((e) => e.month === item.month)
    return {
      month: new Date(item.month).toLocaleString('default', { month: 'short' }),
      Income: item.total,
      Expense: match?.total || 0,
    }
  }) || []

  const pieData = expense_by_category?.map((item) => ({
    name: item.category,
    value: parseFloat(item.total),
  })) || []

  if (loading) return (
    <div className='flex h-screen items-center justify-center'>
      <p className='text-gray-400'>Loading analytics...</p>
    </div>
  )

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar />
      <div className='flex-1 flex flex-col overflow-auto'>
        <Navbar title='Analytics' />

        <div className='p-6 grid grid-cols-2 gap-6'>

          {/* Line Chart */}
          <div className='bg-white rounded-2xl shadow p-6 col-span-2'>
            <h3 className='font-semibold text-gray-700 mb-4'>Monthly Trend</h3>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='Income' stroke='#22c55e' strokeWidth={2} />
                <Line type='monotone' dataKey='Expense' stroke='#ef4444' strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className='bg-white rounded-2xl shadow p-6 col-span-2'>
            <h3 className='font-semibold text-gray-700 mb-4'>Expense by Category</h3>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx='50%'
                  cy='50%'
                  outerRadius={120}
                  dataKey='value'
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  )
}