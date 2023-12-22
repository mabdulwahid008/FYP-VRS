import React from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useDisconnect } from '@thirdweb-dev/react'
import { useNavigate } from 'react-router-dom'

function CompanyRegister() {
    const disconnect = useDisconnect()
    const navigate = useNavigate()
    const goBack = () => {
        disconnect()
        navigate('/company')

    }
  return (
    <div className='bg-[#E5E5E5] h-screen w-full flex justify-center items-center'>
      <div  className='flex justify-center items-end w-[80%] bg-white rounded-xl shadow-lg pr-[40px] py-[40px] gap-10'>\
      <div className='w-[50%]'>
        <h1 className='text-black font-bold text-3xl'>Get Your Company Registered</h1>
        <img src={require('../assets/company.png')} alt="company" className="w-[100%] h-[450px] object-cover"/>
        <button onClick={goBack} className='bg-gray-200 rounded-md shadow-sm cursor-pointer py-2 px-7 text-gray-700 text-sm font-semibold transition-colors hover:bg-gray-300 flex gap-1 items-center justify-center'><IoArrowBack /> Back</button>
      </div>
        <form className='w-[50%] flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
                <label className='text-sm text-black font-semibold'>Company Name</label>
                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='text' name='name' placeholder="Please write your company's official name"/>
            </div>
            <div className='flex justify-between items-start gap-3'>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <label className='text-sm text-black font-semibold'>Company's Mail</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='email' name='mail' placeholder="info@company.com"/>
                </div>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <label className='text-sm text-black font-semibold'>Company's Phone</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='number' name='phone' placeholder="03XXXXXXXXX"/>
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='text-sm text-black font-semibold'>Headquarters</label>
                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='text' name='headquarters' placeholder="Headquarters Address"/>
            </div>
            <div className='flex justify-between items-start gap-3'>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <label className='text-sm text-black font-semibold'>Founder</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='text' name='founder' placeholder="Bilal Ashraf"/>
                </div>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <label className='text-sm text-black font-semibold'>Founded On</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='date' name='founded_on'/>
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='text-sm text-black font-semibold'>Comapny's Profile</label>
                <textarea className='resize-none h-[70px] rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='text' name='headquarters' placeholder="Introduce company profile"></textarea>
            </div>
            <button className='bg-gray-700 rounded-md shadow-sm cursor-pointer py-2 px-10 text-white text-sm font-semibold w-[45%] transition-colors hover:bg-black disabled:bg-gray-500 disabled:cursor-wait' disabled={true}>Register Company</button>
        </form>
      </div>
    </div>
  )
}

export default CompanyRegister
