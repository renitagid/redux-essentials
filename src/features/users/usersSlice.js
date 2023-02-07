import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  { id: '0', name: 'Renita Gidlund' },
  { id: '1', name: 'Cesar Cuadro' },
  { id: '2', name: 'Andrew Carrigan' }
]

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {}
})

export default usersSlice.reducer