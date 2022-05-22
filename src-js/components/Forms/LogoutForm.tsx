import React from 'react'
import Button from '../Button'

const LogoutForm = () => {
  return (
    <form method='post'>
      <Button type='submit' level='btn-secondary'>Cerrar Sesión</Button>
    </form>
  )
}

export default LogoutForm