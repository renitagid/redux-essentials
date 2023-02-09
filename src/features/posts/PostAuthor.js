import React from 'react'
import { useSelector } from 'react-redux'
import { selectUserById } from '../users/usersSlice'
// userId is sent from SinglePostPage or PostsList, and it references the property called user that belongs to a specific post)
export const PostAuthor = ({ userId }) => {
  const author = useSelector((state) => selectUserById(state, userId))

  return <span>by {author ? author.name : 'Unknown author'}</span>
}
