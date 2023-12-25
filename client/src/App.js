import React from 'react'
import Landing from './pages/Landing'
import './App.css'
import { Outlet, Route, Routes } from 'react-router-dom'
import Provider from './state/Provider';
import CompanyRegister from './pages/CompanyRegister';
import CompanyWaiting from './pages/CompanyWaiting';
import Government from './layout/Government';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" />
    </Provider>
  )
}

export default App
