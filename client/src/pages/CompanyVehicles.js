import { useAddress, useContract } from '@thirdweb-dev/react'
import React, { useEffect, useState, useContext } from 'react'
import { VRS_ABI, VRS_ADDRESS } from '../constants'
import { minifyAddress } from '../utills'
import { Link } from 'react-router-dom'
import { Context } from '../state/Provider';
import { ethers } from 'ethers'

function CompanyVehicles() {
    const { setLoadingPage } = useContext(Context)
    const { contract } = useContract(VRS_ADDRESS, VRS_ABI)
    const [vehicles, setVehicles] = useState(null)
    const address = useAddress()

    const fetchvehicles = async () => {
        let events = await contract?.events.getAllEvents()
        console.log(events);
        events = events?.filter((e) => e.eventName === 'VehicleRegistered')
        let registered = []
        for (let i = 0; i < events?.length; i++) {
            if (events[i].data.company === address) {
                const vehicle = await contract?.call('vehicles', [events[i]?.data.vehicleId])
                vehicle.vehicleId = ethers.utils.formatEther(vehicle.vehicleId)
                registered.push(vehicle)
            }
        }

        console.log(registered);
        setVehicles(registered)
        setLoadingPage(false)
    }

    useEffect(() => {
        setLoadingPage(true)
        fetchvehicles()
    }, [contract])
    return (
        <>
            {vehicles && <div className='flex flex-col gap-5 items-start justify-start'>
                <h1 className='font-medium text-left text-2xl text-gray-700'>Registered Vehicles</h1>
                <div className='bg-white rounded-xl shadow-md w-full px-4 py-5 header-animate'>
                    <div className='flex justify-between items-center'>
                    <h1 className='font-medium text-left text-xl text-gray-700'>Vehicles</h1>
                    <Link to='/company/registered-vehicles/new' className='bg-black/75 rounded-md shadow-sm cursor-pointer py-2 px-10 text-white text-sm font-semibold  transition-colors hover:bg-black/100 disabled:bg-red-300 disabled:cursor-wait'>New Vehicle</Link>
                    </div>
                    {vehicles?.length === 0 && <p className='text-gray-700 mt-3'>No data found.</p>}
                    {vehicles?.length !== 0 && <table className='w-full mt-5'>
                        <thead>
                            <tr className='border-b-2 border-gray-300'>
                                <th className='text-gray-900 font-medium w-[50px] text-left py-2'>#</th>
                                <th className='text-gray-900 font-medium w-[30%] text-left'>Chassis Number</th>
                                <th className='text-gray-900 font-medium w-[30%] text-left'>Current Owner</th>
                                <th className='text-gray-900 font-medium text-left'>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles?.map((comp, index) => {
                                return <tr className='border-b-[1px] border-gray-200' key={index}>
                                    <td className='text-gray-700 font-normal w-[50px] text-left py-2 text-sm'>{index + 1}</td>
                                    <td className='text-gray-700 font-normal w-[30%] text-left text-sm'>{comp.vehicleChassisNumber}</td>
                                    <td className='text-gray-700 font-normal w-[30%] text-left text-sm'>{minifyAddress(comp.currentOwner)}</td>
                                    <td className='text-gray-700 font-normal w-[30%] text-left text-sm'><Link to={`/company/registered-vehicles/${comp.vehicleId}`}> Detail </Link></td>
                                </tr>
                            })}
                        </tbody>
                    </table>}
                </div>
            </div>}
        </>
    )
}

export default CompanyVehicles
