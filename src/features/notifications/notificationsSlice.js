import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'

import { client } from '../../api/client'

const notificationsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  //The first argument is ignored, represented by an '_', since it needs two arguments
  // getState is the current global state
  async (_, { getState }) => {
    // this variable is assigned from the selector function we defined at the bottom of this page.
    const allNotifications = selectAllNotifications(getState())
    // Deconstructs allNotifications to make the first notification in the array be assigned to latestNotification
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''

    //Here is where we make the API call
    const response = await client.get(
      // 'Since' will only bring us the notifications at the specified time from latestTimestamp
      `/fakeApi/notifications?since=${latestTimestamp}`
    )
    return response.data
  }
)

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    //reducer to ensure all notifications are read
    allNotificationsRead(state, action) {
      Object.values(state.entities).forEach(notification => {
        notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      notificationsAdapter.upsertMany(state, action.payload)
      Object.values(state.entities).forEach(notification => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.read
      })
    })
  },
})

//exporting reducer allNotificationsRead
export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const { selectAll: selectAllNotifications } =
  notificationsAdapter.getSelectors(state => state.notifications)