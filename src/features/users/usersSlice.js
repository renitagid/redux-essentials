import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit'
// import { client } from '../../api/client'
import { apiSlice } from '../api/apiSlice'
/* const usersAdapter = createEntityAdapter()

 const initialState = usersAdapter.getInitialState() */

// Calling `someEndpoint.select(someArg)` generates a new selector that will return
// the query result object for a query with those parameters.
// To generate a selector for a specific query argument, call `select(theQueryArg)`.
// In this case, the users query has no params, so we don't pass anything to select()
export const selectUsersResult = apiSlice.endpoints.getUsers.select()

const emptyUsers = []

export const selectAllUsers = createSelector(
  selectUsersResult,
  (usersResult) => usersResult?.data ?? emptyUsers
)

export const selectUserById = createSelector(
  selectAllUsers,
  (state, userId) => userId,
  (users, userId) => users.find((user) => user.id === userId)
)
/*
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
    builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
  },
}) 
*/
// export default usersSlice.reducer
// selectAllUsers brings in the state of users

/*
export const { 
  selectAll: selectAllUsers, 
  selectById: selectUserById 
} = usersAdapter.getSelectors((state) => state.users)
*/
