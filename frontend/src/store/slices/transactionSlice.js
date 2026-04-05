import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getTransactionsAPI,
  createTransactionAPI,
  updateTransactionAPI,
  deleteTransactionAPI,
} from '../../api/finance'

// ------------------- Async Thunks -------------------

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      // Remove empty filter params before sending
      const cleanParams = Object.fromEntries(
        Object.entries(params || {}).filter(([_, v]) => v !== '')
      )
      const res = await getTransactionsAPI(cleanParams)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch transactions')
    }
  }
)

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await createTransactionAPI(data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create transaction')
    }
  }
)

export const updateTransaction = createAsyncThunk(
  'transactions/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateTransactionAPI(id, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update transaction')
    }
  }
)

export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteTransactionAPI(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete transaction')
    }
  }
)

// ------------------- Slice -------------------

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    list: [],           // normalized list always an array
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearTransactionMessages(state) {
      state.error = null
      state.successMessage = null
    },
    clearTransactions(state) {
      state.list = []
    },
  },
  extraReducers: (builder) => {
    builder

      // -------- Fetch All --------
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false
        // Normalize — handle both plain array and paginated { results: [] }
        state.list = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.results || []
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.list = []
      })

      // -------- Create --------
      .addCase(createTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false
        // Add new transaction at the top of the list
        state.list.unshift(action.payload)
        state.successMessage = 'Transaction created successfully!'
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // -------- Update --------
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false
        // Replace the updated transaction in the list
        const index = state.list.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
        state.successMessage = 'Transaction updated successfully!'
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // -------- Delete --------
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false
        // Remove deleted transaction from list by id
        state.list = state.list.filter((t) => t.id !== action.payload)
        state.successMessage = 'Transaction deleted successfully!'
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearTransactionMessages, clearTransactions } = transactionSlice.actions
export default transactionSlice.reducer