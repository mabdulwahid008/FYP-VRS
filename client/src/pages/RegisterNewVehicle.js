import { useContract, useContractRead } from '@thirdweb-dev/react'
import React, { useContext, useEffect, useState } from 'react'
import { GoLinkExternal } from 'react-icons/go'
import { VRS_ABI, VRS_ADDRESS } from '../constants'
import { useParams } from 'react-router-dom'
import { Context } from '../state/Provider'

function RegisterNewVehicle() {
    const { setLoadingPage } = useContext(Context)
    const [vehicle, setVehicle] = useState({})
    const [loading, setLoading] = useState(false)
    const { contract } = useContract(VRS_ADDRESS, VRS_ABI)
    const { id } = useParams()
    const { data } = useContractRead(contract, 'companies', [id])

    const onsubmit = (e) => {
        e.preventDefault()

    }

    useEffect(()=>{
        setLoadingPage(false)
    }, [])
    
    return (
        <>
            {vehicle && <div className='flex flex-col gap-5 items-start justify-start'>
                <div className='flex justify-between items-center w-full'>
                    <h1 className='font-medium text-left text-2xl text-gray-700'>Vehicle Detail</h1>
                    <a href={`https://gateway.pinata.cloud/ipfs/${data?.metadata}`} rel="noreferrer" target='_blank' className='text-base underline text-black cursor-pointer'>View on IPFS</a>
                </div>
                <div className='bg-white rounded-xl shadow-md w-full px-5 py-5 header-animate'>
                    <form onSubmit={onsubmit} className='w-full flex flex-col items-end  gap-4' >
                        <div className='flex justify-between items-start gap-3 w-full'>
                            <div className='flex flex-col gap-2 w-[50%]'>
                                <label className='text-sm text-black font-semibold'>Vehicle Name</label>
                                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' value={vehicle?.name} required />
                            </div>
                            <div className='flex flex-col gap-2 w-[50%] relative'>
                                <label className='text-sm text-black font-semibold'>Vehicle Color</label>
                                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' value={data?.account} required />
                            </div>
                        </div>
                        <div className='flex justify-between items-start gap-3 w-full'>
                            <div className='flex flex-col gap-2 w-[50%]'>
                                <label className='text-sm text-black font-semibold'>Body Type</label>
                                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' value={vehicle?.mail} required />
                            </div>
                            <div className='flex flex-col gap-2 w-[50%]'>
                                <label className='text-sm text-black font-semibold'>Chassis Number</label>
                                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' value={vehicle?.phone} required />
                            </div>
                        </div>
                        <div className='flex justify-between items-start gap-3 w-full'>
                            <div className='flex flex-col gap-2 w-[50%]'>
                                <label className='text-sm text-black font-semibold'>Model No</label>
                                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' value={vehicle?.founder} required />
                            </div>
                            <div className='flex flex-col gap-2 w-[50%]'>
                                <label className='text-sm text-black font-semibold'>Engine Number</label>
                                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' value={vehicle?.founded_on} required />
                            </div>
                        </div>
                        {!id &&
                            <button className='bg-black/75 rounded-md shadow-sm cursor-pointer py-2 px-10 text-white text-sm font-semibold w-[45%] transition-colors hover:bg-black/100 disabled:bg-red-300 disabled:cursor-wait' disabled={loading}>Register</button>
                        }
                    </form>
                </div>
            </div>}
        </>
    )
}

export default RegisterNewVehicle
