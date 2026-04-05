import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getFullDashboardAPI } from '../../api/dashboard'

export const fetchDashboard = createAsyncThunk(
  'dashboard/fetchFull',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getFullDashboardAPI()
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    summary: null,
    expense_by_category: [],
    monthly_trends: null,
    recent_activity: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.summary = action.payload.summary
        state.expense_by_category = action.payload.expense_by_category
        state.monthly_trends = action.payload.monthly_trends
        state.recent_activity = action.payload.recent_activity
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default dashboardSlice.reducer