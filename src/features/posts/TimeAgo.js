import React from 'react'

//date fns is a library that was pre-installed when we cloned the repo - it is a tool set for manipulating dates
import { parseISO, formatDistanceToNow } from 'date-fns'

// timestamp is sent as props from SinglePostPage or PostsList, and originates from the property "date" on a post
export const TimeAgo = ({ timestamp }) => {
  let timeAgo = ''
  if (timestamp) {
    const date = parseISO(timestamp)
    const timePeriod = formatDistanceToNow(date)
    timeAgo = `${timePeriod} ago`
  }

  return (
    <span title={timestamp}>
      &nbsp; <i>{timeAgo}</i>
    </span>
  )
}
