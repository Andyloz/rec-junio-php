import React from 'react'
import Button from '../Button'
import FormField from './FormField/FormField'

const LoginForm = () => {
  return (
    <div className='container h-100 d-flex'>
      <div className='m-auto d-flex flex-column flex-md-row align-items-center gap-5'>
        <h2 className='text-center'>
          <span className='display-1 d-md-none'>Iniciar sesión</span>
          <span className='display-3 d-none d-md-block'>Iniciar sesión</span>
        </h2>
        <form className='card shadow-sm p-2' method='post'>
          <div className='card-body'>
            <FormField type={'text'} label='Usuario:' name={'login-username'} maxLength={20} />
            <FormField type={'text'} label='Contraseña:' name={'login-password'} maxLength={6} />
            <Button type='submit' level='btn-primary'>Iniciar Sesión</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm