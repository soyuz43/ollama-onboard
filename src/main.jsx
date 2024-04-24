import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import './index.css'
import './Styles__Master/master.css'; // Import the master.css file
import { BrowserRouter, } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
      <App />
   
  </React.StrictMode>,
)
