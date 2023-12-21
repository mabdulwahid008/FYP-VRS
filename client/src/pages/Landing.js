import React from 'react'

function Landing() {
  return (
    <>
    
    <div className='bg-[#E5E5E5] h-screen w-full px-[200px] flex justify-center items-center gap-[50px]'>
      <div className='w-[50%] flex flex-col gap-5'>
        <h1 className='text-[40px] leading-[50px] text-black font-bold'>Unlock a New Era of Security and Transparency</h1>
        <p className='text-lg text-black font-normal'>Welcome to the future of registration systems, developed by the government for a safer, more transparent, and efficient experience. Empowering businesses to register securely and individuals to take control of ownership transfers.</p>
      </div>
      <div className='w-[45%]'>
            <img className='mt-20' src={require('../assets/Image.png')} alt='bg'/>
      </div>
    </div>

    <div className='h-[500px]'>

    </div>
    </>
  )
}

export default Landing
