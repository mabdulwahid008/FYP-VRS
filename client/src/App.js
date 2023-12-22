import React from 'react'
import Landing from './pages/Landing'
import './App.css'
import { Outlet, Route, Routes } from 'react-router-dom'
import Provider from './state/Provider';
import CompanyRegister from './pages/CompanyRegister';

function App() {
  return (
    <Provider>
      <Routes>
        <Route path='/' element={<Landing />} />
        
        <Route path='company' element={<Outlet />}>
          <Route index element={<Landing />} />
          <Route path='register' element={<CompanyRegister />} />
        </Route>

        <Route path='government' element={<Landing />} />
      </Routes>
    </Provider>
  )
}

export default App
