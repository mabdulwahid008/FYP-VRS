import React from 'react'

function Loading() {
  return (
    <div className='flex justify-center items-center h-screen w-[80%] fixed top-0 bg-[#E5E5E5] opacity-70'>
      <img src={require('../assets/loading.gif')} alt='loading' className='w-[100px] h-[100px]'/>
    </div>
  )
}

export default Loading
