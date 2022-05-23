import React from 'react'
import Button from '../Button'
import FormField from './FormField/FormField'

const LoginForm = () => {
  return (
    <>
      <h2 className='mb-3 mt-5 text-center text-sm-start'>Iniciar Sesión</h2>
      <form method='post'>
        <FormField type={'text'} label='Usuario:' name={'login-username'} maxLength={20} />
        <FormField type={'text'} label='Contraseña:' name={'login-password'} maxLength={6} />
        <Button type='submit' level='btn-primary'>Iniciar Sesión</Button>
      </form>
    </>
  )
}

export default LoginForm