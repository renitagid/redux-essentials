import React from 'react'
import { useDispatch } from 'react-redux'

import { reactionAdded } from './postsSlice'

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
}
//Reaction Buttons is receiving the specific post as props from either SinglePostPage, or PostsList
export const ReactionButtons = ({ post }) => {
  const dispatch = useDispatch()

  // Object.entries returns an array from an object enumerable key-value pairs - an array of arrays
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="muted-button reaction-button"
        onClick={() =>
          dispatch(reactionAdded({ postId: post.id, reaction: name }))
        }
      >
        {/* Posts have a property called reactions, which is an object filled with key:value pairs. [name], tells it we want to display the value at the key of that specific name, which is the current number of those specific reactions */}
        {emoji} {post.reactions[name]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}
