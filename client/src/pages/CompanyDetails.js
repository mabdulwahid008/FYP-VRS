import { useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { COMPANY_ABI, COMPANY_ADDRESS } from '../constants'
import { Context } from '../state/Provider'
import { GoLinkExternal } from "react-icons/go";

function CompanyDetails() {
    const { setLoadingPage } = useContext(Context)
    const [loading, setLoading] = useState(false)
    const [CompanyDetails, setCompanyDetails] = useState(null)
    const { id } = useParams()
    const { contract } = useContract(COMPANY_ADDRESS, COMPANY_ABI)
    const { data } = useContractRead(contract, 'companies', [id])
    const approveCompany = useContractWrite(contract, 'approveCompany', [id])


    const getCompanyDetails = async() => {
        try {
                const response = await fetch(`https://gateway.pinata.cloud/ipfs/${data.metadata}`,{
                    method: 'GET'
                })
                const res = await response.json()
                const check = await contract?.call('isCompanyApproved', [data?.account])
                console.log(check);
                res.isApproved = check
                setCompanyDetails(res)
                setLoadingPage(false)
        } catch (error) {
            console.error(error);
        }
    }

    const approveComp = async() => {
        try {
            setLoading(true)
            approveCompany.mutateAsync({
                args: [id]
            })
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    useEffect(()=>{
        setLoadingPage(true)
        if(data)
            getCompanyDetails()
    }, [data])

  return (
    <div className='flex flex-col gap-5 items-start justify-start'>
        <div className='flex justify-between items-center w-full'>
            <h1 className='font-medium text-left text-2xl text-gray-700'>Company Details</h1>
            <a href={`https://gateway.pinata.cloud/ipfs/${data?.metadata}`} rel="noreferrer" target='_blank' className='text-base underline text-black cursor-pointer'>View on IPFS</a>
        </div>
        <div className='bg-white rounded-xl shadow-md w-full px-5 py-5'>
        <div className='w-full flex flex-col items-end  gap-4' >
            <div className='flex justify-between items-start gap-3 w-full'>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <label className='text-sm text-black font-semibold'>Company Name</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' value={CompanyDetails?.name} readOnly/>
                </div>
                <div className='flex flex-col gap-2 w-[50%] relative'>
                    <label className='text-sm text-black font-semibold'>Company Wallet Address</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' value={data?.account} readOnly/>
                    <a href={`https://sepolia.etherscan.io/address/${data?.account}`} rel="noreferrer" target='_blank' className='px-2'><GoLinkExternal className='absolute right-3 bottom-5 text-base'/></a>
                </div>
            </div>
            <div className='flex justify-between items-start gap-3 w-full'>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <label className='text-sm text-black font-semibold'>Company's Mail</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' value={CompanyDetails?.mail} readOnly/>
                </div>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <label className='text-sm text-black font-semibold'>Company's Phone</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' value={CompanyDetails?.phone} readOnly/>
                </div>
            </div>
            <div className='flex flex-col gap-2 w-full'>
                <label className='text-sm text-black font-semibold'>Headquarters</label>
                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' value={CompanyDetails?.headquarters} readOnly/>
            </div>
            <div className='flex justify-between items-start gap-3 w-full'>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <label className='text-sm text-black font-semibold'>Founder</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' value={CompanyDetails?.founder} readOnly/>
                </div>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <label className='text-sm text-black font-semibold'>Founded On</label>
                    <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' value={CompanyDetails?.founded_on} readOnly/>
                </div>
            </div>
            <div className='flex flex-col gap-2 w-full'>
                <label className='text-sm text-black font-semibold'>Comapny's Profile</label>
                <textarea className='resize-none h-[70px] rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' value={CompanyDetails?.desc} readOnly></textarea>
            </div>
           {CompanyDetails?.isApproved ? 
                <button className='bg-gray-700 rounded-md shadow-sm cursor-pointer py-2 px-10 text-white text-sm font-semibold w-[45%] transition-colors hover:bg-black disabled:bg-gray-500 disabled:cursor-wait' disabled={loading} onClick={approveComp}>Revoke Approval</button>
                :
                <button className='bg-gray-700 rounded-md shadow-sm cursor-pointer py-2 px-10 text-white text-sm font-semibold w-[45%] transition-colors hover:bg-black disabled:bg-gray-500 disabled:cursor-wait' disabled={loading} onClick={approveComp}>Approve Company</button>
           }
            </div>
        </div>
    </div>
  )
}

export default CompanyDetails
