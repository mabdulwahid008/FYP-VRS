import React from 'react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { IoHome } from "react-icons/io5";
import { FaWpforms } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";
import GDashboard from '../pages/GDashboard';
import { CiLogout } from "react-icons/ci";
import NewRegisteredCompanies from '../pages/NewRegisteredCompanies';
import { useDisconnect } from '@thirdweb-dev/react';

function Government() {
  const disconnect = useDisconnect()
    const navigate = useNavigate()
    const goBack = () => {
        disconnect()
        navigate('/government')
    }
  return (
    <div className='flex bg-[#E5E5E5] w-full'>
      <div className='flex bg-[#3c3c3c] w-[20%] h-screen shadow-3xl fixed top-0 left-0 px-8 pt-[50px] flex-col justify-between items-start overflow-hidden'>
            <h1 className='text-white font-bold text-left text-xl leading-[20px]'>Vehicle Registration System</h1>
            <nav className='flex flex-col gap-4 justify-start items-start -mt-[400px]'>
                <NavLink to='/government/dashboard' className='text-gray-300 text-sm cursor-pointer flex justify-center items-center gap-2'><IoHome  className='text-2xl'/> Dashboard</NavLink>
                <NavLink to='/government/company-applications' className='text-gray-300 text-sm cursor-pointer flex justify-center items-start gap-2'><FaWpforms className='text-xl'/> Company Applications</NavLink>
                <NavLink to='/government/approved-companies' className='text-gray-300 text-sm cursor-pointer flex justify-center items-start gap-2'><FaCheckSquare className='text-xl'/>Approved Companies</NavLink>
            </nav>
            <button onClick={goBack} className='bg-black py-2 text-sm text-white w-[129%] -ml-8 flex justify-start items-center gap-2 px-20'><CiLogout className='text-xl'/>Log Out</button>
      </div>
      <div className='ml-[20%] w-[80%] px-10 py-8 h-screen'>
        <Routes>
          <Route path='dashboard' element={<GDashboard />}/>
          <Route path='company-applications' element={<NewRegisteredCompanies />}/>
        </Routes>
      </div>
    </div>
  )
}

export default Government
