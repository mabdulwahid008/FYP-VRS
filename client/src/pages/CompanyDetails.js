import { useContract, useContractRead } from '@thirdweb-dev/react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { COMPANY_ABI, COMPANY_ADDRESS } from '../constants'
import { Context } from '../state/Provider'
import { create } from 'ipfs-http-client';

function CompanyDetails() {
    const { setLoadingPage } = useContext(Context)
    const [loading, setLoading] = useState(false)
    const { id } = useParams()
    const { contract } = useContract(COMPANY_ADDRESS, COMPANY_ABI)
    const { data } = useContractRead(contract, 'companies', [id])


    const getCompanyDetails = async() => {
        try {
            // const metaData = await fetch(`https://ipfs.io/ipfs/${data.metadata}`, {method:'GET', headers:{'Content-Type': 'Application/json'}})
            const ipfs = create({ host: 'ipfs.io/ipfs', port: 3000, protocol: 'https' });
            const response = await ipfs.cat(data.metadata);
            const chunks = [];
    
            // Collect chunks of data
            for await (const chunk of response) {
              chunks.push(chunk);
            }
    
            // Combine the chunks into a single string or buffer, depending on the data type
            const x = Buffer.isBuffer(chunks[0]) ? Buffer.concat(chunks) : chunks.join('');
            console.log(x);
            setLoadingPage(false)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(()=>{
        setLoadingPage(true)
        if(data)
            getCompanyDetails()
    }, [data])

  return (
    <div className='flex flex-col gap-5 items-start justify-start'>
        <h1 className='font-medium text-left text-2xl text-gray-700'>Company Details</h1>
        <div className='bg-white rounded-xl shadow-md w-full px-5 py-5'>
        <form className='w-full flex flex-col gap-4' >
            <div className='flex flex-col gap-2'>
                <label className='text-sm text-black font-semibold'>Company Name</label>
                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='text' name='name' placeholder="Please write your company's official name" readOnly/>
            </div>
            <div className='flex justify-between items-start gap-3'>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <label className='text-sm text-black font-semibold'>Company's Mail</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='email' name='mail' placeholder="info@company.com" readOnly/>
                </div>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <label className='text-sm text-black font-semibold'>Company's Phone</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='number' name='phone' placeholder="03XXXXXXXXX" readOnly/>
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='text-sm text-black font-semibold'>Headquarters</label>
                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='text' name='headquarters' placeholder="Headquarters Address" readOnly/>
            </div>
            <div className='flex justify-between items-start gap-3'>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <label className='text-sm text-black font-semibold'>Founder</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='text' name='founder' placeholder="Bilal Ashraf" readOnly/>
                </div>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <label className='text-sm text-black font-semibold'>Founded On</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='date' name='founded_on' readOnly/>
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='text-sm text-black font-semibold'>Comapny's Profile</label>
                <textarea className='resize-none h-[70px] rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-500' required type='text' name='headquarters' placeholder="Introduce company profile" readOnly></textarea>
            </div>
            <button className='bg-gray-700 rounded-md shadow-sm cursor-pointer py-2 px-10 text-white text-sm font-semibold w-[45%] transition-colors hover:bg-black disabled:bg-gray-500 disabled:cursor-wait' disabled={loading}>Register Company</button>
        </form>
        </div>
    </div>
  )
}

export default CompanyDetails
