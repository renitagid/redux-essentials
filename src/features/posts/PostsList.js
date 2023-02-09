import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Spinner } from '../../components/Spinner'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { useGetPostsQuery } from '../api/apiSlice'

//
let PostExcerpt = ({ post }) => {
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

// PostsList is using apiSlice for query hooks to return a result object
export const PostsList = () => {
  const {
    // data is the actual response from the server
    data: posts = [],
    // isLoading is a boolean indicating if the hook is making the first request to the server
    isLoading,
    // isSuccess is a boolean if the hook has made a successful request and has cached data available
    isSuccess,
    // isError is a boolean indicating if the last request had an error
    isError,
    // error is a serialized object
    error
  } = useGetPostsQuery()

  const sortedPosts = useMemo(() => {
    const sortedPosts = posts.slice()
    // Sort posts in descending chronological order
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = sortedPosts.map(post => <PostExcerpt key={post.id} post={post} />)
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
