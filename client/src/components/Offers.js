import { useAddress, useContract } from '@thirdweb-dev/react'
import React, { useState } from 'react'
import { VRS_ABI, VRS_ADDRESS } from '../constants'
import { uploadToIPFS } from '../utills'
import { ethers } from 'ethers'

function Offers({ sellerOffer, setRefresh }) {
    const address = useAddress()
    const [loading, setLoading] = useState()
    const { contract } = useContract(VRS_ADDRESS, VRS_ABI)

    const [user, setUser] = useState()

    const acceptOffer = async(e, o) => {
        e.preventDefault()
        setLoading(true)
        try {

            const metadata_cid = await uploadToIPFS(user);
            const priceInWei = ethers.utils.parseEther(o.price.toString()); // Convert price to string
            await contract.call('acceptOffer', [o.vehicleId, metadata_cid, priceInWei],  {value: priceInWei});
            

            setRefresh(s => !s)

        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    }
  return (
    <div className='flex flex-col gap-5 items-start justify-start bg-white rounded-xl shadow-md w-full px-5 py-5 header-animate'>
    <h1 className='font-semibold text-xl'>Created Offer</h1>
    {sellerOffer?.map((o, i) => (
    <div  className='w-full flex flex-col items-end  gap-4 border-[1px] border-black/50 p-2 rounded-md' >
        <div className='flex justify-between items-start gap-3 w-full'>
            <div className='flex flex-col gap-2 w-[50%]'>
                <label className='text-sm text-black font-semibold'>Sell to</label>
                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' type='text' readOnly name='buyer' defaultValue={o.sell_to} required />
            </div>
            <div className='flex flex-col gap-2 w-[50%] relative'>
                <label className='text-sm text-black font-semibold'>Price</label>
                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' type='text' readOnly name='price' defaultValue={o.price} required />
            </div>
            <div className='flex flex-col gap-2 w-[50%] relative'>
                <label className='text-sm text-black font-semibold'>Till</label>
                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' type='text' readOnly name='time' defaultValue={o.tillTime.replace('T', ' ').substr(0, 16)} required />
            </div>
        </div>
       {o.sell_to === address && <form onSubmit={(e) => acceptOffer(e, o)} className='flex w-full flex-col'>

        <div className='flex justify-between items-start gap-3 w-full'>
            <div className='flex flex-col gap-2 w-[50%]'>
                <label className='text-sm text-black font-semibold'>Your Name</label>
                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' type='text' name='name' required onChange={(e) => setUser({...user, [e.target.name]: e.target.value})}/>
            </div>
            <div className='flex flex-col gap-2 w-[50%] relative'>
                <label className='text-sm text-black font-semibold'>Your CNIC</label>
                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' type='text' name='cnic' required onChange={(e) => setUser({...user, [e.target.name]: e.target.value})}/>
            </div>
            <div className='flex flex-col gap-2 w-[50%] relative'>
                <label className='text-sm text-black font-semibold'>Your Father Name</label>
                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' type='text' name='father_name' required onChange={(e) => setUser({...user, [e.target.name]: e.target.value})}/>
            </div>
        </div>
           <button className='bg-black/75 rounded-md shadow-sm cursor-pointer py-2 px-10 text-white text-sm font-semibold w-[45%] transition-colors hover:bg-black/100 disabled:bg-red-300 disabled:cursor-wait' disabled={loading}>Accept Offer</button>
       </form>
       
       }
    </div>))}
</div>
  )
}

export default Offers
