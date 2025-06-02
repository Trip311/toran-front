import React from 'react'
import  ReactDOM from 'react-dom/client'
import AppRounter from './AppRouter.js'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './Components/layout/HomePage/Calendar/redux/store.js'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
        <AppRounter/>
    </Provider>
    </BrowserRouter>
  </React.StrictMode>
)
