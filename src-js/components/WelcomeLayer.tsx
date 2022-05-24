import React, { FC } from 'react'
import LogoutForm from './Forms/LogoutForm'
import User from './shapes/User'

interface IProps {
  user: User
}

const WelcomeLayer: FC<IProps> = ({ user }) => {
  return (
    <div className='d-flex flex-row flex-wrap align-items-center mt-4'>
      <p className='m-0 mb-2 me-4 mb-sm-0'>Bienvenido, <span>{ user.usuario }</span></p>
      <LogoutForm />
    </div>
  )
}

export default WelcomeLayer