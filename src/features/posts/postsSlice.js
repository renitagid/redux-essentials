import { createSlice, nanoid } from '@reduxjs/toolkit'
import { sub } from 'date-fns'
//setting initial state to work with in slice
//initial state is an array of posts containg 5 properties
//id,title,content,date,reactions
const initialState = [
  {
    id: '1',
    title: 'First Post!',
    content: 'Hello!',
    user: '0',
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: {
      thumbsUp: 0,
      hooray: 0,
      heart: 0,
      rocket: 0,
      eyes: 0,
    },
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'More text',
    user: '2',
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: {
      thumbsUp: 0,
      hooray: 0,
      heart: 0,
      rocket: 0,
      eyes: 0,
    },
  },
]

// create the actual slice - it is a function that takes an object as an argument. That object contains the logic for the reducers.
//name is set to posts and utilizing initial state
const postsSlice = createSlice({
  // The slice uses name to create the action creator.
  name: 'posts',
  //   It looks at the initial state, which was defined above
  initialState,
  reducers: {
    // All the different reducers for this feature are added into the reducers object(?)
    // Question: why does postAdded reducer have a different syntax than reactionAdded and postUpdated?
    // All of them take state and action as parameters. All of them define what the payload is, and give some logic for what to do with the payload.
    //reducer to add posts to existing posts
    postAdded: {
      reducer(state, action) {
        // Question: is "state" here referencing the global state? - the payload (the new post) is being pushed onto the array
        state.push(action.payload)
      },
      //   prepare gives formatting to the post - it receives its parameters from where dispatch calls this reducer in AddPostForm
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
            reactions: {
              thumbsUp: 0,
              hooray: 0,
              heart: 0,
              rocket: 0,
              eyes: 0,
            },
          },
        }
      },
    },
    //reducer to add raction to post
    reactionAdded(state, action) {
      // action.payload is deconstructed (because it is sent an entire object), then if a post exists patching the postId from the payload, then one reaction wll be added to the existing post's reaction number.
      const { postId, reaction } = action.payload
      const existingPost = state.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    //reducer to update existing post
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.find((post) => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
  },
})

// The individual reducer methods are exported deconstructed, while the entire reducer function is exported as default
// Currently the reducer methods are postAdded, postUpdated and reactionAdded.

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions
//exporting slice to apply to store
export default postsSlice.reducer
