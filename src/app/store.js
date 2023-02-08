import { configureStore } from '@reduxjs/toolkit'

import postsReducer from '../features/posts/postsSlice'
import usersReducer from '../features/users/usersSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'

// All reducers need to be added in here - store is passed to Provider so all components have access to all reducers. Reducers originate from slices. Separate slices by feature.
// This is where the current state and the actions being dispatched come together to generate the new current state of the app
export default configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    notifications: notificationsReducer
  },
})
