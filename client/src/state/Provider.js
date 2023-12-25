import { useAddress, useContract, useContractRead } from '@thirdweb-dev/react'
import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COMPANY_ABI, COMPANY_ADDRESS, GOV_ABI, GOV_ADDRESS } from '../constants'
import { toast } from 'react-toastify'

export const Context = createContext()

function Provider(props) {
  const address = useAddress()
  const navigate = useNavigate()
  const companyContract = useContract(COMPANY_ADDRESS, COMPANY_ABI);
  const govContract = useContract(GOV_ADDRESS, GOV_ABI);

  const [pendingCompany, setPendingCompany] = useState(null)

  const [loadingPage, setLoadingPage] = useState(false)

  const isCompanyRegistered = async() => {
    const events = await companyContract?.contract?.events.getAllEvents({
      eventName: "Register",
    })
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
            navigate('/company/dashboard')
          else
            navigate('/company/waiting')
        }
        else
          navigate('/company/register')
    }

    else if(window.location.pathname.startsWith('/government')){
      const check = await govContract?.contract?.call('isAuthorized', [address])
      if(check)
        navigate('/government/dashboard')
      else{
        navigate('/government')
        toast.error('You are not authorized.')
      }
    }
    else{
      // navigate('/dashboard')
    }
  }

  useEffect(()=>{
    if(address){
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
