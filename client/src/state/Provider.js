import { useAddress, useContract, useDisconnect } from '@thirdweb-dev/react'
import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { COMPANY_ABI, COMPANY_ADDRESS, GOV_ABI, GOV_ADDRESS } from '../constants'

export const Context = createContext()

function Provider(props) {
  const address = useAddress()
  
  const disonnect = useDisconnect()
  const navigate = useNavigate()
  const companyContract = useContract(COMPANY_ADDRESS, COMPANY_ABI);
  const govContract = useContract(GOV_ADDRESS, GOV_ABI);

  const [pendingCompany, setPendingCompany] = useState(null)

  const [loadingPage, setLoadingPage] = useState(false)

  const isCompanyRegistered = async() => {
    const events = await companyContract?.contract?.events.getAllEvents()
    console.log(events);
    console.log(address);
    const company = events?.filter((e) => e.data.account.toLowerCase() === address.toLowerCase())
    if(company && company?.length !== 0){
      setPendingCompany(company[0].data.name);
      return true
    }
    return false
  }

  const isCompanyApproved = async() => {
    const check = await companyContract?.contract?.call('isCompanyApproved', [address])
    if(check === true)
      return true
    return false
  }

  const handleNavigations = async() => {
    if(window.location.pathname.startsWith('/company')){
        const registered = await isCompanyRegistered()
        if(registered){
          const approved = await isCompanyApproved()
          if(approved)
            navigate('/company/registered-vehicles')
          else
            navigate('/company/waiting')
        }
        else
          navigate('/company/register')
    }

    else if(window.location.pathname.startsWith('/government')){
      const check = await govContract?.contract?.call('isAuthorized', [address])
      // const check = await govContract?.contract?.call('grantAuthorization', ['0xA785b969469D1A5e752E82d39d69668F5A327e6D'])
      if(check)
        navigate('/government/dashboard')
      else{
        disonnect()
        toast.error('Not Authorized.')
        navigate('/government')
      }
    }
    else{
      navigate('/my-vehicles')
    }
  }

  useEffect(()=>{
    if(address && govContract?.contract && companyContract?.contract){
      handleNavigations()
    }
  }, [address])

    const contextValues = {
      pendingCompany,
      loadingPage, setLoadingPage
    }
  return (
    <Context.Provider value={contextValues}>
      {props.children}
    </Context.Provider>
  )
}

export default Provider
