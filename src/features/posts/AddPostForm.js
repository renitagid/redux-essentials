import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { postAdded } from './postsSlice'

// Question: is this essentially the same as just writing const AddPostForm and then export default AddPostForm at the bottom?
export const AddPostForm = () => {
  // The title, content, and user id will all be set using the useState hook - they are in local state as opposed to global state, because the rest of the app does not care about it.
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')
  // the useDispatch hook gives us the store's dispatch method as its result - this is how we dispatch actions and send them to the reducer
  const dispatch = useDispatch()

  //   The useSelector hook is used to get the current state from the store - here we are getting specifically the state of users and setting it as the variable users.
  const users = useSelector((state) => state.users)

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)
  const onAuthorChanged = (e) => setUserId(e.target.value)

  //   if the user has entered a title and content, the dispatch method will be run with an argument of the specific reducer (postAdded), which in turn has an argument of the title, content and user id. Then it updates the local state for the title and content fields.
  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(postAdded(title, content, userId))
      setTitle('')
      setContent('')
    }
  }

  // this function checks if a title, content, and userId are present and is used to enable/disable the button
  const canSave = Boolean(title) && Boolean(content) && Boolean(userId)

  //   logic for a dropdown where you can assign a user to the post (rendered below)
  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        {/* In this form, each input has a value and an onChange, so it can be updated with useState */}
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  )
}
