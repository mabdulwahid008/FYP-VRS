import React from 'react'
import { ConnectWallet } from '@thirdweb-dev/react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div className='flex px-8 py-4 justify-between items-center bg-white shadow-lg rounded-br-lg rounded-bl-lg fixed top-0 left-[15%] w-[70%] header-animate'>
      <div className='flex gap-10 justify-start items-center'>
        <h2 className='text-[36px] text-black font-bold'>VRS</h2>
        <nav className='flex justify-start items-end gap-6'>
            <Link to='#' className='text-gray-700 text-base cursor-pointer'>About</Link>
            <Link to='#' className='text-gray-700 text-base cursor-pointer'>Ownership</Link>
            <Link to='#' className='text-gray-700 text-base cursor-pointer'>Security</Link>
            <Link to='#' className='text-gray-700 text-base cursor-pointer'>Transparency</Link>
        </nav>
      </div>

      <ConnectWallet theme={'light'} className='text-sm'/>
    </div>
  )
}

export default Navbar
