import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTransactions,
  deleteTransaction,
  createTransaction,
} from '../store/slices/transactionSlice'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

const CATEGORIES = [
  'salary',
  'food',
  'rent',
  'transport',
  'healthcare',
  'entertainment',
  'utilities',
  'other',
]

export default function Transactions() {
  const dispatch = useDispatch()
  const { list, loading, error } = useSelector((state) => state.transactions)
  const { role } = useSelector((state) => state.auth)

  const [filters, setFilters] = useState({ type: '', category: '' })
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    amount: '',
    type: 'income',
    category: 'other',
    date: '',
    notes: '',
  })
  const [successMessage, setSuccessMessage] = useState(null)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    dispatch(fetchTransactions(filters))
  }, [filters])

  // Auto clear messages after 3 seconds
  useEffect(() => {
    if (successMessage || formError) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
        setFormError(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, formError])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(id))
      setSuccessMessage('Transaction deleted successfully!')
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setFormError(null)

    // Basic frontend validation
    if (!form.amount || form.amount <= 0) {
      setFormError('Amount must be greater than zero.')
      return
    }
    if (!form.date) {
      setFormError('Please select a date.')
      return
    }

    const result = await dispatch(createTransaction(form))
    if (createTransaction.fulfilled.match(result)) {
      setSuccessMessage('Transaction created successfully!')
      setShowForm(false)
      setForm({
        amount: '',
        type: 'income',
        category: 'other',
        date: '',
        notes: '',
      })
    } else {
      setFormError('Failed to create transaction. Please try again.')
    }
  }

  // Normalize list — handle both array and paginated response
  const transactions = Array.isArray(list) ? list : list?.results || []

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar />
      <div className='flex-1 flex flex-col overflow-auto'>
        <Navbar title='Transactions' />

        <div className='p-6 space-y-4'>

          {/* Success Message */}
          {successMessage && (
            <div className='bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm'>
              ✅ {successMessage}
            </div>
          )}

          {/* Error Message */}
          {(formError || error) && (
            <div className='bg-red-100 text-red-600 px-4 py-3 rounded-lg text-sm'>
              ❌ {formError || JSON.stringify(error)}
            </div>
          )}

          {/* Filters + Add Button */}
          <div className='flex items-center gap-4 flex-wrap'>

            {/* Type Filter */}
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>All Types</option>
              <option value='income'>Income</option>
              <option value='expense'>Expense</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>

            {/* Transaction Count */}
            <span className='text-sm text-gray-400'>
              {transactions.length} record{transactions.length !== 1 ? 's' : ''} found
            </span>

            {/* Add Button — Admin Only */}
            {role === 'admin' && (
              <button
                onClick={() => setShowForm(!showForm)}
                className='ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition'
              >
                {showForm ? '✕ Cancel' : '+ Add Transaction'}
              </button>
            )}
          </div>

          {/* Add Transaction Form — Admin Only */}
          {showForm && role === 'admin' && (
            <div className='bg-white rounded-2xl shadow p-6'>
              <h3 className='font-semibold text-gray-700 mb-4 text-base'>
                📝 New Transaction
              </h3>

              {formError && (
                <div className='bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm mb-4'>
                  ❌ {formError}
                </div>
              )}

              <form onSubmit={handleCreate} className='grid grid-cols-2 gap-4'>

                {/* Amount */}
                <div className='flex flex-col gap-1'>
                  <label className='text-xs font-medium text-gray-600'>
                    Amount (₹) *
                  </label>
                  <input
                    type='number'
                    placeholder='e.g. 5000'
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                    min='1'
                    className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                {/* Type */}
                <div className='flex flex-col gap-1'>
                  <label className='text-xs font-medium text-gray-600'>
                    Type *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value='income'>Income</option>
                    <option value='expense'>Expense</option>
                  </select>
                </div>

                {/* Category */}
                <div className='flex flex-col gap-1'>
                  <label className='text-xs font-medium text-gray-600'>
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className='flex flex-col gap-1'>
                  <label className='text-xs font-medium text-gray-600'>
                    Date *
                  </label>
                  <input
                    type='date'
                    value={form.date}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                {/* Notes */}
                <div className='flex flex-col gap-1 col-span-2'>
                  <label className='text-xs font-medium text-gray-600'>
                    Notes (optional)
                  </label>
                  <input
                    type='text'
                    placeholder='e.g. April salary payment'
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                {/* Buttons */}
                <div className='col-span-2 flex gap-3'>
                  <button
                    type='submit'
                    className='bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition text-sm'
                  >
                    💾 Save Transaction
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setShowForm(false)
                      setFormError(null)
                      setForm({
                        amount: '',
                        type: 'income',
                        category: 'other',
                        date: '',
                        notes: '',
                      })
                    }}
                    className='bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition text-sm'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Transactions Table */}
          <div className='bg-white rounded-2xl shadow p-6'>
            {loading ? (
              <div className='text-center py-12'>
                <p className='text-gray-400 text-sm'>Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className='text-center py-12'>
                <p className='text-4xl mb-3'>📭</p>
                <p className='text-gray-500 font-medium'>No transactions found</p>
                <p className='text-gray-400 text-sm mt-1'>
                  {role === 'admin'
                    ? 'Click "+ Add Transaction" to create one.'
                    : 'No transactions available yet.'}
                </p>
              </div>
            ) : (
              <table className='w-full text-sm'>
                <thead>
                  <tr className='text-left text-gray-500 border-b'>
                    <th className='pb-3 font-medium'>#</th>
                    <th className='pb-3 font-medium'>Date</th>
                    <th className='pb-3 font-medium'>Category</th>
                    <th className='pb-3 font-medium'>Type</th>
                    <th className='pb-3 font-medium'>Amount</th>
                    <th className='pb-3 font-medium'>Notes</th>
                    {role === 'admin' && (
                      <th className='pb-3 font-medium'>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, index) => (
                    <tr
                      key={t.id}
                      className='border-b last:border-0 hover:bg-gray-50 transition'
                    >
                      {/* Index */}
                      <td className='py-3 text-gray-400'>{index + 1}</td>

                      {/* Date */}
                      <td className='py-3 text-gray-600'>{t.date}</td>

                      {/* Category */}
                      <td className='py-3 capitalize text-gray-700'>
                        {t.category}
                      </td>

                      {/* Type Badge */}
                      <td className='py-3'>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${t.type === 'income'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-500'
                          }`}
                        >
                          {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                        </span>
                      </td>

                      {/* Amount */}
                      <td
                        className={`py-3 font-semibold
                        ${t.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-500'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'}₹
                        {Number(t.amount).toLocaleString()}
                      </td>

                      {/* Notes */}
                      <td className='py-3 text-gray-400 max-w-xs truncate'>
                        {t.notes || '—'}
                      </td>

                      {/* Actions — Admin Only */}
                      {role === 'admin' && (
                        <td className='py-3'>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className='text-red-500 hover:text-red-700 text-xs font-semibold hover:underline'
                          >
                            🗑 Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>

                {/* Table Footer — Total */}
                <tfoot>
                  <tr className='border-t bg-gray-50'>
                    <td colSpan={role === 'admin' ? 4 : 3} className='py-3 px-1 text-sm font-semibold text-gray-600'>
                      Total
                    </td>
                    <td className='py-3 font-bold text-blue-600'>
                      ₹{transactions
                        .reduce((sum, t) =>
                          t.type === 'income'
                            ? sum + Number(t.amount)
                            : sum - Number(t.amount), 0)
                        .toLocaleString()}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}