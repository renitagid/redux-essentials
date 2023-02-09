import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersSlice'
import { addNewPost } from './postsSlice'

// Question: is this essentially the same as just writing const AddPostForm and then export default AddPostForm at the bottom?
export const AddPostForm = () => {
  // The title, content, and user id will all be set using the useState hook - they are in local state as opposed to global state, because the rest of the app does not care about it.
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')
  const [addRequestStatus, setAddRequestStatus] = useState('idle')
  // the useDispatch hook gives us the store's dispatch method as its result - this is how we dispatch actions and send them to the reducer
  const dispatch = useDispatch()

  //   The useSelector hook is used to get the current state from the store - here we are getting specifically the state of users and setting it as the variable users.
  const users = useSelector(selectAllUsers)

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)
  const onAuthorChanged = (e) => setUserId(e.target.value)

  // this function checks if a title, content, and userId are present and is used to enable/disable the button
  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

  //   if all conditions in canSave are met, "try" allows you to define a block of code to be tested for errors while it is being executed - here it will run the dispatch for reducer addNewPost and then .unwrap() returns a new Promise that either has the actual action.payload value from a fulfilled action, or throws an error if it's the rejected action
  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        await dispatch(addNewPost({ title, content, user: userId })).unwrap()
        setTitle('')
        setContent('')
        setUserId('')
      } catch (err) {
        console.error('Failed to save the post: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }

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
