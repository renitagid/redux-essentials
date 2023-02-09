import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Spinner } from '../../components/Spinner'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import {
    fetchPosts,
    selectPostIds,
    selectPostById
  } from './postsSlice'

//
let PostExcerpt = ({ postId }) => {
    const post = useSelector(state => selectPostById(state, postId))
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

export const PostsList = () => {
  const dispatch = useDispatch()
  const orderedPostIds = useSelector(selectPostIds)
  const error = useSelector((state) => state.posts.error)
  // postStatus is using the useSelector to access the state of posts for the status of the fetch request
  const postStatus = useSelector((state) => state.posts.status)
  // useEffect is a hook that is going to run on the first render, if that status is idle, then it will fetchPosts.
  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
    // Run the useEffect again when postStatus changes
  }, [postStatus, dispatch])

  let content

  if (postStatus === 'loading') {
    content = <Spinner text="Loading..." />
  } else if (postStatus === 'succeeded') {
    // Sort posts in reverse chronological order by datetime string
    content = orderedPostIds.map(postId => (
        <PostExcerpt key={postId} postId={postId} />
      ))
  } else if (postStatus === 'failed') {
    content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
