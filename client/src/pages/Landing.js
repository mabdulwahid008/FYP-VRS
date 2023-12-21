import React from 'react'
import Navbar from '../components/Navbar'

function Landing() {
  return (
    <>
    <Navbar />
    
    <div className='bg-[#E5E5E5] h-screen w-full px-[180px] flex justify-center items-center gap-[40px]'>
      <div className='w-[60%] flex flex-col gap-5'>
        <h1 className='text-[44px] leading-[50px] text-black font-bold'>Unlock a New Era of Security and Transparency</h1>
        <p className='text-lg text-black font-normal'>Welcome to the future of registration systems, developed by the government for a safer, more transparent, and efficient experience. Empowering businesses to register securely and individuals to take control of ownership transfers.</p>
        <button className='bg-gray-700 rounded-md shadow-sm cursor-pointer py-4 px-10 text-white font-semibold w-[50%]'>Register Company</button>
      </div>
      <div className='w-[40%]'>
            <img className='mt-20' src={require('../assets/Image.png')} alt='bg'/>
      </div>
    </div>

    <div className='h-[500px]'>

    </div>
    </>
  )
}

export default Landing
