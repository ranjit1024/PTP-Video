import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sender from './components/sender'
import Receiver from './components/receiver'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/sender' element={<Sender/>}/>
      <Route path='/receiver' element={<Receiver/>}/>
    </Routes>
    </BrowserRouter>
     
    </>
  )
}

export default App
