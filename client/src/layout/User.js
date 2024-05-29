import React, { useContext, useEffect } from 'react'
import { NavLink, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { IoHome } from "react-icons/io5";
import { FaWpforms } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";
import GDashboard from '../pages/GDashboard';
import { CiLogout } from "react-icons/ci";
import NewRegisteredCompanies from '../pages/NewRegisteredCompanies';
import { useAddress, useDisconnect } from '@thirdweb-dev/react';
import CompanyDetails from '../pages/CompanyDetails';
import Loading from '../pages/Loading';
import { Context } from '../state/Provider';
import ApprovedComapnies from '../pages/ApprovedComapnies';
import MyOffers from '../pages/MyOffers';
import RegisterNewVehicle from '../pages/RegisterNewVehicle';

function User() {
  const { loadingPage } = useContext(Context)
  const address = useAddress()
  const disconnect = useDisconnect()
    const navigate = useNavigate()
    const goBack = () => {
        disconnect()
        navigate('/')
    }
    useEffect(()=>{
      if(!address)
        navigate('/')
    }, [])
  return (
    <div className='flex bg-[#E5E5E5] w-full'>
      <div className='flex bg-[#3c3c3c] w-[20%] h-screen shadow-3xl fixed top-0 left-0 px-8 pt-[50px] flex-col justify-between items-start overflow-hidden'>
            <h1 className='text-white font-bold text-left pl-4 text-[50px] leading-[20px]'>VRS</h1>
            <nav className='flex flex-col gap-4 justify-start items-start -mt-[400px]'>
                <NavLink to='/my-vehicles' className='text-gray-300 text-sm cursor-pointer flex justify-center items-center gap-2'><IoHome  className='text-2xl'/> My Vehicles</NavLink>
                <NavLink to='/offers' className='text-gray-300 text-sm cursor-pointer flex justify-center items-start gap-2'><FaWpforms className='text-xl'/> Offers</NavLink>
                <NavLink to='/market' className='text-gray-300 text-sm cursor-pointer flex justify-center items-start gap-2'><FaCheckSquare className='text-xl'/>Market</NavLink>
            </nav>
            <button onClick={goBack} className='bg-black py-2 text-sm text-white w-[129%] -ml-8 flex justify-start items-center gap-2 px-20'><CiLogout className='text-xl'/>Log Out</button>
      </div>
      <div className='ml-[20%] w-[80%]'>
        <div className='px-10 py-8 h-screen'>
          <Routes>
            <Route path='offers' element={<MyOffers />}/>
            <Route path='vehicle/:id' element={<RegisterNewVehicle />}/>
           
          </Routes>
        </div>
        {loadingPage && <Loading />}
      </div>
    </div>
  )
}

export default User
