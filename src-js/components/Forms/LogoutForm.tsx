import React, { FormEventHandler } from 'react'
import useApi from '../../hooks/useApi'

const LogoutForm = () => {
  const { response, doRequest } = useApi<'msg'>()

  const handleLogoutPress: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    doRequest('api/logout', {
      method: 'POST',
    })
  }

  return (
    <form onSubmit={ handleLogoutPress }>
      <button type='submit' className='btn btn-secondary'>Cerrar Sesión</button>
    </form>
  )
}

export default LogoutForm