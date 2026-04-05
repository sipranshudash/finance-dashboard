import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboard } from '../store/slices/dashboardSlice'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'

export default function Dashboard() {
  const dispatch = useDispatch()
  const { summary, monthly_trends, recent_activity, loading } = useSelector(
    (state) => state.dashboard
  )

  useEffect(() => {
    dispatch(fetchDashboard())
  }, [])

  // Merge monthly income & expense for chart
  const chartData = monthly_trends?.income?.map((item) => {
    const match = monthly_trends.expense?.find(
      (e) => e.month === item.month
    )
    return {
      month: new Date(item.month).toLocaleString('default', { month: 'short' }),
      Income: item.total,
      Expense: match?.total || 0,
    }
  }) || []

  if (loading) return (
    <div className='flex h-screen items-center justify-center'>
      <p className='text-gray-500 text-lg'>Loading dashboard...</p>
    </div>
  )

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar />
      <div className='flex-1 flex flex-col overflow-auto'>
        <Navbar title='Dashboard' />

        <div className='p-6 space-y-6'>

          {/* Summary Cards */}
          <div className='grid grid-cols-3 gap-6'>
            <div className='bg-white rounded-2xl shadow p-6'>
              <p className='text-sm text-gray-500'>Total Income</p>
              <p className='text-3xl font-bold text-green-600 mt-1'>
                ₹{summary?.total_income?.toLocaleString() || 0}
              </p>
            </div>
            <div className='bg-white rounded-2xl shadow p-6'>
              <p className='text-sm text-gray-500'>Total Expense</p>
              <p className='text-3xl font-bold text-red-500 mt-1'>
                ₹{summary?.total_expense?.toLocaleString() || 0}
              </p>
            </div>
            <div className='bg-white rounded-2xl shadow p-6'>
              <p className='text-sm text-gray-500'>Net Balance</p>
              <p className={`text-3xl font-bold mt-1 ${
                summary?.net_balance >= 0 ? 'text-blue-600' : 'text-red-500'
              }`}>
                ₹{summary?.net_balance?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          {/* Monthly Trend Chart */}
          <div className='bg-white rounded-2xl shadow p-6'>
            <h3 className='text-lg font-semibold text-gray-700 mb-4'>
              Monthly Income vs Expense
            </h3>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='Income' fill='#22c55e' radius={[4, 4, 0, 0]} />
                <Bar dataKey='Expense' fill='#ef4444' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className='bg-white rounded-2xl shadow p-6'>
            <h3 className='text-lg font-semibold text-gray-700 mb-4'>
              Recent Activity
            </h3>
            <table className='w-full text-sm'>
              <thead>
                <tr className='text-left text-gray-500 border-b'>
                  <th className='pb-2'>Date</th>
                  <th className='pb-2'>Category</th>
                  <th className='pb-2'>Type</th>
                  <th className='pb-2'>Amount</th>
                  <th className='pb-2'>Notes</th>
                </tr>
              </thead>
              <tbody>
                {recent_activity?.map((t) => (
                  <tr key={t.id} className='border-b hover:bg-gray-50'>
                    <td className='py-2'>{t.date}</td>
                    <td className='py-2 capitalize'>{t.category}</td>
                    <td className='py-2'>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${t.type === 'income'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-500'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`py-2 font-semibold
                      ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                      ₹{Number(t.amount).toLocaleString()}
                    </td>
                    <td className='py-2 text-gray-400'>{t.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}