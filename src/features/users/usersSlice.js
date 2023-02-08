import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'

// not keeping track of the status of fetching users in state yet, since this is not going to be displayed anywhere(?)
const initialState = []

// createAsyncThunk is being passed a type and a payload
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users')
  return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  // In extraReducers, we are saying, when fetchUsers has been fulfilled, then return the payload (which is the users)
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      // this return replaces the existing state with whatever is returned
      return action.payload
    })
  }
})

export default usersSlice.reducer