import React from 'react'
import Landing from './pages/Landing'
import './App.css'
import { Outlet, Route, Routes } from 'react-router-dom'
import Provider from './state/Provider';
import CompanyRegister from './pages/CompanyRegister';
import CompanyWaiting from './pages/CompanyWaiting';
import Government from './layout/Government';

function App() {
  return (
    <Provider>
      <Routes>
        <Route path='/' element={<Landing />} />
        
        <Route path='company' element={<Outlet />}>
          <Route index element={<Landing />} />
          <Route path='register' element={<CompanyRegister />} />
          <Route path='waiting' element={<CompanyWaiting />} />
        </Route>

        <Route path='government' element={<Outlet />}>
          <Route index element={<Landing />} />
          <Route path='*' element={<Government/>} />
        </Route>

      </Routes>
    </Provider>
  )
}

export default App
