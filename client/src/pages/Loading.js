import React from 'react'

function Loading() {
  return (
    <div className='flex justify-center items-center h-screen fixed top-0 w-[80%] overflow-hidden'>
      <div className='h-screen w-[80%] fixed top-0  backdrop-opacity-20 backdrop-invert bg-white/30'></div>
      <img src={require('../assets/loading.gif')} alt='loading' className='w-[100px] h-[100px] z-[999999999]'/>
    </div>
  )
}

export default Loading
