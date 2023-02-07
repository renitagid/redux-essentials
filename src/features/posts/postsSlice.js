import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from '@reduxjs/toolkit'
import { sub } from 'date-fns'


//setting initial state to work with in slice 
//initial state is an array of posts containg 5 properties
//id,title,content,date,reactions
const initialState = [
  {
    id: '1',
    title: 'First Post!',
    content: 'Hello!',
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'More text',
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}
  },
]

//creating slice to use for post
//name is set to posts and utilizing intitial state
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    //reducer to add raction to post
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    //reducer to add posts to existing posts
    postAdded: {
      reducer(state, action) {
        state.push(action.payload)
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
          },
        }
      },
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

//exporting nessecary reducers
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

//exporting slice to apply to store
export default postsSlice.reducer
