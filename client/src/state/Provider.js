import { useAddress } from '@thirdweb-dev/react'
import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Context = createContext()

function Provider(props) {
  const address = useAddress()
  const navigate = useNavigate()

  useEffect(()=>{
    if(address){
        if(window.location.pathname.startsWith('/company')){
          navigate('/company/register')
        }
        else if(window.location.pathname.startsWith('/government')){
          navigate('/about')
        }
        else{
          // navigate('/dashboard')
        }
    }
  }, [address])

    const contextValues = {

    }
  return (
    <Context.Provider value={contextValues}>
      {props.children}
    </Context.Provider>
  )
}

export default Provider
