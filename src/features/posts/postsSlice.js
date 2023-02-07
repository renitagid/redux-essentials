import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'

//setting initial state to work with in slice
//initial state is an array of posts containg 5 properties
//id,title,content,date,reactions
const initialState = {
  posts: [],
  status: 'idle',
  error: null
}

//exporting the function fetchPosts to be used elsewhere in order to an API call
  //the second argument to createAsyncThunk returns a Promise containing data or a rejected Promise with an error
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})


// create the actual slice - it is a function that takes an object as an argument. That object contains the logic for the reducers.
//name is set to posts and utilizing initial state
const postsSlice = createSlice({
  // The slice uses name to create the action creator.
  name: 'posts',
  //   It looks at the initial state, which was defined above
  initialState,
  reducers: {
    // slice-specific reducers here
    // All the different reducers for this feature are added into the reducers object(?)
    // Question: why does postAdded reducer have a different syntax than reactionAdded and postUpdated?
    // All of them take state and action as parameters. All of them define what the payload is, and give some logic for what to do with the payload.
    //reducer to add posts to existing posts
    postAdded: {
      reducer(state, action) {
        // Question: is "state" here referencing the global state? - the payload (the new post) is being pushed onto the array
        state.posts.push(action.payload)
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
      const existingPost = state.posts.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    //reducer to update existing post
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.posts.find(post => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
    // reducer to respond to other actions that were not defined as part of this slice's reducers property
  },
  //ensure extraReducers are right after the reducers property, otherwise posts will not render on the page
  extraReducers(builder) {
    builder
    // when the request starts
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      // when the requests succeeds add the fetched posts to state.posts
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.posts = state.posts.concat(action.payload)
      })
      //when the request fails
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})
// The individual reducer methods are exported deconstructed, while the entire reducer function is exported as default
// Currently the reducer methods are postAdded, postUpdated and reactionAdded.
// Question: unsure if extraReducers was implied to be exported, but just in case was explicitly exported it

export const { postAdded, postUpdated, reactionAdded, extraReducers } = postsSlice.actions
//exporting slice to apply to store
export default postsSlice.reducer
// We need the code below to change postSlice as an array of posts to 
  //an object with the posts array nested inside
//the state parameter is the root Redux state object
// selectAllPosts is used to read a list of all the posts
export const selectAllPosts = state => state.posts.posts
//selectPostById is used to read a singular post by using its ID
export const selectPostById = (state, postId) =>
  state.posts.posts.find(post => post.id === postId)