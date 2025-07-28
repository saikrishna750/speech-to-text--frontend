import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import UploadForm from './pages/UploadForm'
import Navbar from './components/Navbar'
import Transcriptions from './pages/Transcriptions'

function App() {
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<UploadForm/> }/>
        <Route path="/transcriptions" element={<Transcriptions/>}/>
        <Route path='*' element={<h1 className='mt-18 p-5'>404 page not found</h1>}/>
      </Routes>
    </>
  )
}

export default App
