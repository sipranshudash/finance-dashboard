import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosInstance'

// ------------------- API Calls -------------------

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/auth/')
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch users')
    }
  }
)

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/auth/${id}/`, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update user')
    }
  }
)

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/auth/${id}/`)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete user')
    }
  }
)

export const createUser = createAsyncThunk(
  'users/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/register/', data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create user')
    }
  }
)

// ------------------- Slice -------------------

const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearUserMessages(state) {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false
        state.list.push(action.payload)
        state.successMessage = 'User created successfully!'
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        const index = state.list.findIndex((u) => u.id === action.payload.id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
        state.successMessage = 'User updated successfully!'
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        state.list = state.list.filter((u) => u.id !== action.payload)
        state.successMessage = 'User deleted successfully!'
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearUserMessages } = userSlice.actions
export default userSlice.reducer