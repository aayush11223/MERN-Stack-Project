import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Enquiry from './Enquiry'

function App() {

  return (
    <>
      {/* global toast container lives at the app root */}
      <ToastContainer />
      <Enquiry />

    </>
  )
}

export default App
