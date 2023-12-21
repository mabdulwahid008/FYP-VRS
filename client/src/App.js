import React from 'react'
import Landing from './pages/Landing'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Provider from './state/Provider';

function App() {
  return (
    <Provider>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/company' element={<Landing />}>
          <Route path='register' element={<div>hello</div>} />
        </Route>
        <Route path='/government' element={<Landing />} />
      </Routes>
    </Provider>
  )
}

export default App
