import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "react-datepicker/dist/react-datepicker.css";  //Just include the datepicker before my index so that it can override some element styles.
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
