import { useContract } from '@thirdweb-dev/react'
import React, { useEffect, useState, useContext } from 'react'
import { COMPANY_ABI, COMPANY_ADDRESS } from '../constants'
import { minifyAddress } from '../utills'
import { Link } from 'react-router-dom'
import { Context } from '../state/Provider';

function ApprovedComapnies() {
    const { setLoadingPage } = useContext(Context)
    const { contract } = useContract(COMPANY_ADDRESS, COMPANY_ABI)
    const [companies, setCompanies] = useState(null)

    const fetchCompanies = async() =>{
        let events = await contract?.events.getAllEvents()
        events = events.filter((e) => e.eventName === 'Approved')

        let approvedComp = []
        for (let i = 0; i < events?.length; i++) {
           const approved = await contract?.call('isCompanyApproved', [events[i]?.data.account])
            if(approved)
            approvedComp.push(events[i]?.data)
        }
        setCompanies(approvedComp)
        setLoadingPage(false)
    }
    
    useEffect(()=>{
        setLoadingPage(true)
        fetchCompanies()
    }, [contract])
  return (
    <div className='flex flex-col gap-5 items-start justify-start'>
        <h1 className='font-medium text-left text-2xl text-gray-700'>Approved Company</h1>
        <div className='bg-white rounded-xl shadow-md w-full px-4 py-5 transition-all duration-100 ease-linear'>
            <h1 className='font-medium text-left text-xl text-gray-700'>Companies providing services</h1>
           {companies && <table className='w-full mt-5'>
                <thead>
                    <tr className='border-b-2 border-gray-300'>
                        <th className='text-gray-900 font-medium w-[50px] text-left py-2'>#</th>
                        <th className='text-gray-900 font-medium w-[30%] text-left'>Company Name</th>
                        <th className='text-gray-900 font-medium w-[30%] text-left'>Company Address</th>
                        <th className='text-gray-900 font-medium text-left'>Registered Date</th>
                        <th className='text-gray-900 font-medium text-left'>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {companies?.map((comp, index)=>{
                         return <tr className='border-b-[1px] border-gray-200' key={index}>
                                    <td className='text-gray-700 font-normal w-[50px] text-left py-2 text-sm'>{index+1}</td>
                                    <td className='text-gray-700 font-normal w-[30%] text-left text-sm'>{comp.name}</td>
                                    <td className='text-gray-700 font-normal w-[30%] text-left text-sm'>{minifyAddress(comp.account)}</td>
                                    <td className='text-gray-700 font-normal text-left text-sm'>{new Date(comp.timestamp * 1000).toDateString()}</td>
                                    <td className='text-gray-700 font-normal text-left text-sm'><Link to={comp.index.toString()}>Details</Link></td>
                            </tr>
                    })}
                </tbody>
            </table>}
        </div>
    </div>
  )
}

export default ApprovedComapnies
