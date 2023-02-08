import React, { useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formatDistanceToNow, parseISO } from 'date-fns'
import classnames from 'classnames'

import { selectAllUsers } from '../users/usersSlice'

import {
  selectAllNotifications,
  allNotificationsRead,
} from './notificationsSlice'

export const NotificationsList = () => {
  const dispatch = useDispatch()
  const notifications = useSelector(selectAllNotifications)
  const users = useSelector(selectAllUsers)

  //useLayoutEffect dispatches after the notifications are rendered in order to organize the layout of the screen
  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })

  const renderedNotifications = notifications.map((notification) => {
    const date = parseISO(notification.date)
    //takes current time/date to tell you how long ago the notification was made
    const timeAgo = formatDistanceToNow(date)
    // ensures current user is the user who is on the notification
    const user = users.find((user) => user.id === notification.user) || {
      name: 'Unknown User',
    }

    //It will format the notification if it has the 'new' property, if it does not, then it will not format the notification
    const notificationClassname = classnames('notification', {
      new: notification.isNew,
    })

    // this return is with renderedNotifications
    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  // this return is with NotificationsList
  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
