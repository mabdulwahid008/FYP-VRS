import { useContract } from '@thirdweb-dev/react'
import React, { useState } from 'react'
import { VRS_ABI, VRS_ADDRESS } from '../constants'
import { ethers } from 'ethers'

function CreateOffer({ id, setRefresh }) {

    const [offer, setOffer] = useState()
    const [loading, setLoading] = useState()

    const { contract } = useContract(VRS_ADDRESS, VRS_ABI)

    const onChange = (e) => {
        setOffer({ ...offer, [e.target.name]: e.target.value })
        console.log(offer);
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const unixTime = new Date(offer.time).getTime() / 1000;
            const priceInWei = ethers.utils.parseEther(offer.price); // Convert Ether to Wei
            const priceUint256 = ethers.BigNumber.from(priceInWei)
            await contract.call('createOffer', [id, offer.buyer, priceUint256, unixTime])
            setRefresh(s =>!s)
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    }
    return (
        <div className='flex flex-col gap-5 items-start justify-start bg-white rounded-xl shadow-md w-full px-5 py-5 header-animate'>
            <h1 className='font-semibold text-xl'>Create Selling Offer</h1>
            <form onSubmit={onSubmit} className='w-full flex flex-col items-end  gap-4' >
                <div className='flex justify-between items-start gap-3 w-full'>
                    <div className='flex flex-col gap-2 w-[50%]'>
                        <label className='text-sm text-black font-semibold'>Sell to</label>
                        <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' type='text' name='buyer' defaultValue={''} required onChange={onChange} />
                    </div>
                    <div className='flex flex-col gap-2 w-[50%] relative'>
                        <label className='text-sm text-black font-semibold'>Price</label>
                        <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' type='text' name='price' defaultValue={''} required onChange={onChange} />
                    </div>
                    <div className='flex flex-col gap-2 w-[50%] relative'>
                        <label className='text-sm text-black font-semibold'>Till</label>
                        <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' type='date' name='time' defaultValue={''} required onChange={onChange} />
                    </div>
                </div>
                <button className='bg-black/75 rounded-md shadow-sm cursor-pointer py-2 px-10 text-white text-sm font-semibold w-[45%] transition-colors hover:bg-black/100 disabled:bg-red-300 disabled:cursor-wait' disabled={loading}>Create Offer</button>
            </form>
        </div>
    )
}

export default CreateOffer
