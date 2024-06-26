import { useAddress, useContract, useContractRead } from '@thirdweb-dev/react'
import React, { useContext, useEffect, useState } from 'react'
import { GoLinkExternal } from 'react-icons/go'
import { VRS_ABI, VRS_ADDRESS } from '../constants'
import { useNavigate, useParams } from 'react-router-dom'
import { Context } from '../state/Provider'
import { uploadToIPFS } from '../utills';
import CreateOffer from './CreateOffer'
import { ethers } from 'ethers'
import Offers from '../components/Offers'

function RegisterNewVehicle() {
    const { setLoadingPage } = useContext(Context)
    const [vehicle, setVehicle] = useState({})
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [sellerOffer, setSellerOffer] = useState(null)
    const [validForSeeling, setValidForSelling] = useState(false)
    const { contract } = useContract(VRS_ADDRESS, VRS_ABI)
    const { id } = useParams()
    const { data } = useContractRead(contract, 'companies', [id])

    const [vehicleData, setVehicleData] = useState({})

    const nvaigate = useNavigate()

    const onChange = (e) => {
        setVehicleData({ ...vehicleData, [e.target.name]: e.target.value })
        console.log(vehicleData);
    }

    const onsubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const cid = await uploadToIPFS(vehicleData)

            await contract.call('registerNewVhecile', [cid, vehicleData.chassisnumber])
            nvaigate(-1)
        } catch (error) {
            alert("error", error)
        }
        setLoading(false)

    }

    useEffect(() => {
        setLoadingPage(false)
    }, [vehicleData])

    const fetchData = async () => {
        try {
            const x = await contract.call("vehicles", [id])
            const response = await fetch(`https://gateway.pinata.cloud/ipfs/${x.vehicleMetadata}`, {
                method: 'GET'
            })
            const res = await response.json()
            setVehicleData(res)
        } catch (error) {

        }
    }

    const address = useAddress()

    const isValidForseeling = async () => {
        const vehicle = await contract.call('vehicles', [id])
        if (vehicle.currentOwner === '0x0000000000000000000000000000000000000000' && vehicle.vehicleCompany === address)
            setValidForSelling(true)
        else if (vehicle.currentOwner === address)
            setValidForSelling(true)
    }

    const getOffers = async () => {
        let events = await contract?.events.getAllEvents()
        events = events?.filter((e) => e.eventName === 'SellerOffer')
        let SellerOffer = []
        for (let i = 0; i < events.length; i++) {
            const tillTimeBigNumber = ethers.BigNumber.from(events[i]?.data.tillTime);
            const tillTimeSeconds = tillTimeBigNumber.toNumber();
            const tillTimeDate = new Date(tillTimeSeconds * 1000).toISOString();

            let vehicleId = parseInt(ethers.utils.formatEther(events[i]?.data.vehicleId))

            const vehicle = await contract?.call('vehicles', [vehicleId])

            if (tillTimeDate > new Date().toISOString() && (vehicle.currentOwner === address || vehicle.vehicleCompany === address)) {
                SellerOffer.push({
                    vehicleId: parseInt(ethers.utils.formatEther(events[i]?.data.vehicleId)),
                    tillTime: tillTimeDate,
                    sell_to: events[i]?.data.buyer,
                    price: parseFloat(ethers.utils.formatEther(events[i]?.data.price)),
                })
            }
            else {
                if (tillTimeDate > new Date().toISOString() && events[i]?.data.buyer === address)
                    SellerOffer.push({
                        vehicleId: parseInt(ethers.utils.formatEther(events[i]?.data.vehicleId)),
                        tillTime: tillTimeDate,
                        sell_to: events[i]?.data.buyer,
                        price: parseFloat(ethers.utils.formatEther(events[i]?.data.price)),
                    })
            }

        }

        setSellerOffer(SellerOffer)
    }

    useEffect(() => {
        if (id) {
            fetchData()
            isValidForseeling()
            getOffers()
        }
    }, [id, refresh])

    return (
        <>
            {vehicle && <div className='flex flex-col gap-5 items-start justify-start'>
                <div className='flex justify-between items-center w-full'>
                    <h1 className='font-medium text-left text-2xl text-gray-700'>Vehicle Detail</h1>
                    {/* <a href={`https://gateway.pinata.cloud/ipfs/${data?.metadata}`} rel="noreferrer" target='_blank' className='text-base underline text-black cursor-pointer'>View on IPFS</a> */}
                </div>
                <div className='bg-white rounded-xl shadow-md w-full px-5 py-5 header-animate'>
                    <form onSubmit={onsubmit} className='w-full flex flex-col items-end  gap-4' >
                        <div className='flex justify-between items-start gap-3 w-full'>
                            <div className='flex flex-col gap-2 w-[50%]'>
                                <label className='text-sm text-black font-semibold'>Vehicle Name</label>
                                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' readOnly={id ? true : false} name='name' value={vehicleData?.name} required onChange={onChange} />
                            </div>
                            <div className='flex flex-col gap-2 w-[50%] relative'>
                                <label className='text-sm text-black font-semibold'>Vehicle Color</label>
                                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' readOnly={id ? true : false} name='color' value={vehicleData?.color} required onChange={onChange} />
                            </div>
                        </div>
                        <div className='flex justify-between items-start gap-3 w-full'>
                            <div className='flex flex-col gap-2 w-[50%]'>
                                <label className='text-sm text-black font-semibold'>Body Type</label>
                                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' readOnly={id ? true : false} name='body_type' value={vehicleData?.body_type} required onChange={onChange} />
                            </div>
                            <div className='flex flex-col gap-2 w-[50%]'>
                                <label className='text-sm text-black font-semibold'>Chassis Number</label>
                                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' readOnly={id ? true : false} name='chassisnumber' value={vehicleData?.chassisnumber} required onChange={onChange} />
                            </div>
                        </div>
                        <div className='flex justify-between items-start gap-3 w-full'>
                            <div className='flex flex-col gap-2 w-[50%]'>
                                <label className='text-sm text-black font-semibold'>Model No</label>
                                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' readOnly={id ? true : false} name='modelno' value={vehicleData?.modelno} required onChange={onChange} />
                            </div>
                            <div className='flex flex-col gap-2 w-[50%]'>
                                <label className='text-sm text-black font-semibold'>Engine Number</label>
                                <input className='rounded-md outline-none px-3 py-2 text-sm border-[1px] border-gray-300' readOnly={id ? true : false} name='e_no' value={vehicleData?.e_no} required onChange={onChange} />
                            </div>
                        </div>
                        {!id && <button className='bg-black/75 rounded-md shadow-sm cursor-pointer py-2 px-10 text-white text-sm font-semibold w-[45%] transition-colors hover:bg-black/100 disabled:bg-red-300 disabled:cursor-wait' disabled={loading}>Register</button>}
                    </form>
                </div>

                {/* {vehicle.currentOwner && } */}

                {validForSeeling && <CreateOffer id={id} setRefresh={setRefresh} />}
                {sellerOffer?.length > 0 && <Offers id={id} sellerOffer={sellerOffer} setRefresh={setRefresh} />}
            </div>}
        </>
    )
}

export default RegisterNewVehicle
