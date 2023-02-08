import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { client } from '../../api/client'

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  //The first argument is ignored, represented by an '_', since it needs to arguments
  // getState is the current global state
  async (_, { getState }) => {
    // allNotifications are coming from the current state
    const allNotifications = selectAllNotifications(getState())
    // Destructors allNotifications to make the first notification in the array be assigned to latestNotification
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
  initialState: [],
  reducers: {
    //reducer to ensure all notifications are read
    allNotificationsRead(state, action) {
      state.forEach((notification) => {
        notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.push(...action.payload)
      state.forEach((notification) => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.read
      })
      // Sort with newest first
      state.sort((a, b) => b.date.localeCompare(a.date))
    })
  },
})

//exporting reducer allNotificationsRead
export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const selectAllNotifications = (state) => state.notifications
