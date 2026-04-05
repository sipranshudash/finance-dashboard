import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginAPI, getMeAPI } from '../../api/auth'

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await loginAPI(credentials)
      localStorage.setItem('access_token', res.data.access)
      localStorage.setItem('refresh_token', res.data.refresh)
      const me = await getMeAPI()
      return me.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Login failed')
    }
  }
)

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMeAPI()
      return res.data
    } catch {
      return rejectWithValue('Session expired')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    role: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.role = null
      state.isAuthenticated = false
      localStorage.clear()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.role = action.payload.role
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.role = action.payload.role
        state.isAuthenticated = true
      })
      .addCase(loadUser.rejected, (state) => {
        state.isAuthenticated = false
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer