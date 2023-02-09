import {
  createSlice,
  nanoid,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'

// new function postsAdapter using the createEntity that we are importing from toolkit - sorts posts by date
// createEntityAdapter accepts an options object that may include a sortComparer function
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

// replaces initial state and lets our new function set up the initial state
const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
})

//exporting the function fetchPosts to be used elsewhere in order to make an API call
//the second argument to createAsyncThunk returns a Promise containing data or a rejected Promise with an error
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

// exporting the function addNewPost to be used elsewhere in order to make an API call
export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  // The payload creator receives the partial `{title, content, user}` object
  async (initialPost) => {
    // We send the initial data to the fake API server
    const response = await client.post('/fakeApi/posts', initialPost)
    // The response includes the complete post object, including unique ID
    return response.data
  }
)

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
    //reducer to add reaction to post
    reactionAdded(state, action) {
      // action.payload is deconstructed (because it is sent an entire object), then if a post exists patching the postId from the payload, then one reaction wll be added to the existing post's reaction number.
      const { postId, reaction } = action.payload

      //   This replaces the logic to match the post id to the params - instead it can use the params to just look up the id from entities
      const existingPost = state.entities[postId]
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    //reducer to update existing post
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.entities[id]
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
        // Use the `upsertMany` reducer as a mutating update utility
        postsAdapter.upsertMany(state, action.payload)
      })
      // when the request fails
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      // when the post request succeeds
      // Use the `addOne` reducer for the fulfilled case
      .addCase(addNewPost.fulfilled, postsAdapter.addOne)
  },
})
// The individual reducer methods are exported deconstructed, while the entire reducer function is exported as default
// Currently the reducer methods are postAdded, postUpdated and reactionAdded.
// Question: unsure if extraReducers was implied to be exported, but just in case was explicitly exported it

export const { postAdded, postUpdated, reactionAdded, extraReducers } =
  postsSlice.actions
//exporting slice to apply to store
export default postsSlice.reducer
// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors((state) => state.posts)

//if there are more than one selectors, put it inside of an array. selectAllPosts is the first input selector function, defined above, it gives us posts. the second one we need is just the userId, but to format it as a selector function we need to input state and userId just to return userId. Given these, now we can execute the output selector function that filters all posts by userId.
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.user === userId)
)
