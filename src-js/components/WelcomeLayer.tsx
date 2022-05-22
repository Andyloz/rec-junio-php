import React from 'react'
import LogoutForm from './Forms/LogoutForm'

const WelcomeLayer = () => {
  return (
    <div className='d-flex flex-row flex-wrap align-items-center mt-4'>
      <p className='m-0 mb-2 me-4 mb-sm-0 '>Bienvenido <span></span></p>
      <LogoutForm/>
    </div>
  )
}

export default WelcomeLayer