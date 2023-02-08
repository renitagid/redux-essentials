import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectAllUsers } from './usersSlice'

// Creates a list of users
export const UsersList = () => {
    // selectAllUsers is imported from usersSlice.js
  const users = useSelector(selectAllUsers)

  //renderedUsers maps through all the users in order to render each user as a link
  const renderedUsers = users.map(user => (
    <li key={user.id}>
      <Link to={`/users/${user.id}`}>{user.name}</Link>
    </li>
  ))

  return (
    <section>
      <h2>Users</h2>

      <ul>{renderedUsers}</ul>
    </section>
  )
}