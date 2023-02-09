import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'
import { apiSlice } from './features/api/apiSlice'
import { worker } from './api/server'

// Wrap app rendering so we can wait for the mock API to initialize
async function main() {
  // Start our mock API server
  await worker.start({ onUnhandledRequest: 'bypass' })

  store.dispatch(apiSlice.endpoints.getUsers.initiate())

  ReactDOM.render(
    <React.StrictMode>
      {/* Use the Provider component to wrap the entire app, to give all children elements access to the global state. Store is passed as props */}
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

main()
