import React, { useState } from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useContract, useContractWrite, useDisconnect } from '@thirdweb-dev/react'
import { useNavigate } from 'react-router-dom'
import { uploadToIPFS } from '../utills';
import { COMPANY_ABI, COMPANY_ADDRESS } from '../constants';

// Government Address is 0x77Dc44aef68e7473e569E94186fE4a32990ffC0D
// Company Address is 0xfde9eA7b37bE0295C3f1771DB247f3F40DbBDF4b
// VRS Address is 0xC8D81076aC8d6124700502e4059999d8D369908B

function CompanyRegister() {
    const disconnect = useDisconnect()
    const navigate = useNavigate()
    const [companyData, setCompanyData] = useState()
    const [loading, setLoading] = useState(false)

    const { contract } = useContract(COMPANY_ADDRESS, COMPANY_ABI);
    const { mutateAsync } = useContractWrite(contract, "registerCompany");

    const onChange = (e) => {
        setCompanyData({...companyData, [e.target.name]: e.target.value})
    }
    const goBack = () => {
        disconnect()
        navigate('/company')
    }
    const registerCompany = async(e) =>{
        e.preventDefault()
        setLoading(true)
        try {
            const cid = await uploadToIPFS(companyData)
            await mutateAsync({
                args: [companyData.name, cid],
              })
            navigate('/company/waiting')
        } catch (error) {
            console.error(error);
        }
        setLoading(false)
    }
  return (
    <div className='bg-[#E5E5E5] h-screen w-full flex justify-center items-center'>
      <div className='flex justify-center items-end w-[80%] bg-white rounded-xl shadow-lg pr-[40px] py-[40px] gap-10 header-animate'>\
      <div className='w-[50%]'>
        <h1 className='text-black font-bold text-3xl'>Get Your Company Registered</h1>
        <img src={require('../assets/company.png')} alt="company" className="w-[100%] h-[450px] object-cover"/>
        <button onClick={goBack} className='bg-gray-200 rounded-md shadow-sm cursor-pointer py-2 px-7 text-gray-700 text-sm font-semibold transition-colors hover:bg-gray-300 flex gap-1 items-center justify-center'><IoArrowBack /> Back</button>
      </div>
        <form className='w-[50%] flex flex-col gap-4' onSubmit={registerCompany}>
            <div className='flex flex-col gap-2'>
                <label className='text-sm text-black font-semibold'>Company Name</label>
                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='text' name='name' placeholder="Please write your company's official name" onChange={onChange}/>
            </div>
            <div className='flex justify-between items-start gap-3'>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <label className='text-sm text-black font-semibold'>Company's Mail</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='email' name='mail' placeholder="info@company.com" onChange={onChange}/>
                </div>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <label className='text-sm text-black font-semibold'>Company's Phone</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='number' name='phone' placeholder="03XXXXXXXXX" onChange={onChange}/>
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='text-sm text-black font-semibold'>Headquarters</label>
                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='text' name='headquarters' placeholder="Headquarters Address" onChange={onChange}/>
            </div>
            <div className='flex justify-between items-start gap-3'>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <label className='text-sm text-black font-semibold'>Founder</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='text' name='founder' placeholder="Bilal Ashraf" onChange={onChange}/>
                </div>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <label className='text-sm text-black font-semibold'>Founded On</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='date' name='founded_on' onChange={onChange}/>
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='text-sm text-black font-semibold'>Comapny's Profile</label>
                <textarea className='resize-none h-[70px] rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='text' name='desc' placeholder="Introduce company profile" onChange={onChange}></textarea>
            </div>
            <button className='bg-gray-700 rounded-md shadow-sm cursor-pointer py-2 px-10 text-white text-sm font-semibold w-[45%] transition-colors hover:bg-black disabled:bg-gray-500 disabled:cursor-wait' disabled={loading}>Register Company</button>
        </form>
      </div>
    </div>
  )
}

export default CompanyRegister
