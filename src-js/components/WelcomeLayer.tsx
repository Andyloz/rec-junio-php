import React, { FC, MouseEventHandler } from 'react'
import User from './shapes/User'

interface IProps {
  user: User
  onPressedLogout: () => void
}

const WelcomeLayer: FC<IProps> = ({ user, onPressedLogout }) => {

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    onPressedLogout()
  }

  return (
    <div className='d-flex flex-row flex-wrap align-items-center mt-4'>
      <p className='m-0 mb-2 me-4 mb-sm-0'>Bienvenido, <span>{ user.usuario }</span></p>
      <button
        type='submit'
        className='btn btn-secondary'
        onClick={ handleClick }
      >Cerrar Sesión
      </button>
    </div>
  )
}

export default WelcomeLayer