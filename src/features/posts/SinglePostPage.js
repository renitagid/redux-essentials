import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Spinner } from '../../components/Spinner'
import { useGetPostQuery } from '../api/apiSlice'

import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'

// React Router will pass in a match object as a prop that contains the URL information we're looking for (sent when we set up the route in App.js)
export const SinglePostPage = ({ match }) => {
  const { postId } = match.params

  const { data: post, isFetching, isSuccess } = useGetPostQuery(postId)
 
  let content
  if (isFetching) {
    content = <Spinner text="Loading..." />
    console.log(isFetching)
  } else if (isSuccess) {
    console.log(isSuccess)
    content = (
      <article className="post">
        <h2>{post.title}</h2>
        <div>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    )
  }

  // if (!post) {
  //   return (
  //     <section>
  //       <h2>Post not found!</h2>
  //     </section>
  //   )
  // }

  return (
    <section>
      {content}
    </section>
  )
}
