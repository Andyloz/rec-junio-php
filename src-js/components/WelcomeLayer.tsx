import React, { FC } from 'react'
import User from './shapes/User'
import useApi from '../hooks/useApi'

interface IProps {
  user: User
}

const WelcomeLayer: FC<IProps> = ({ user }) => {
  const { response, doRequest } = useApi<{ msg: string }>()

  return (
    <div className='d-flex flex-row flex-wrap align-items-center mt-4'>
      <p className='m-0 mb-2 me-4 mb-sm-0'>Bienvenido, <span>{ user.usuario }</span></p>
      <button
        type='submit'
        className='btn btn-secondary'
        onClick={() => doRequest('api/logout', { method: 'POST' })}
      >Cerrar Sesión</button>
    </div>
  )
}

export default WelcomeLayer