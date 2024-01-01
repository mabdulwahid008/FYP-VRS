import { useAddress, useDisconnect } from '@thirdweb-dev/react'
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context } from '../state/Provider'

function CompanyWaiting() {
    const { pendingCompany } = useContext(Context)
    const disconnect = useDisconnect()
    const address = useAddress()
    const navigate = useNavigate()
    const goBack = () => {
        disconnect()
        navigate('/company')
    }

    useEffect(()=>{
      if(!address)
        navigate('/company')
    }, [])

  return (
    <div className='bg-[#E5E5E5] h-screen w-full flex justify-center items-center'>
       <div className='flex flex-col justify-center items-center w-[40%] bg-white rounded-xl shadow-lg px-[40px] py-[40px] gap-5 header-animate'>
            <h1 className='text-black font-bold text-3xl'>Hey {pendingCompany}</h1>
            <p className='text-base text-gray-700 text-center'><span className='font-bold'>Pending Government Approval</span><br/> You are currently in the waiting list for official clearance. Your patience is appreciated as you await the official decision. Please check back soon for updates</p>
            <button onClick={goBack} className='bg-gray-200 rounded-md shadow-sm cursor-pointer py-2 px-7 text-gray-700 text-sm font-semibold transition-colors hover:bg-gray-300 flex gap-1 items-center justify-center'>Back</button>
        </div>
    </div>
  )
}

export default CompanyWaiting
