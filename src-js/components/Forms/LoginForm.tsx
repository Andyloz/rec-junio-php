import React, { FC, FormEventHandler } from 'react'
import Button from '../Button'
import FormField from './FormField/FormField'

interface IProps {
  onPressedLogin: (data: FormData) => void
}

const LoginForm: FC<IProps> = ({ onPressedLogin }) => {

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (e.currentTarget.checkValidity()) {
      const formData = new FormData(e.currentTarget)
      onPressedLogin(formData)
    }
  }

  return (
    <div className='container h-100 d-flex'>
      <div className='m-auto d-flex flex-column flex-md-row align-items-center gap-5'>
        <h2 className='text-center'>
          <span className='display-1 d-md-none'>Iniciar sesión</span>
          <span className='display-3 d-none d-md-block'>Iniciar sesión</span>
        </h2>
        <form className='card shadow-sm p-2' onSubmit={ handleSubmit }>
          <div className='card-body'>
            <FormField type={ 'text' } labelText='Usuario:' name={ 'login-username' } maxLength={ 20 } required />
            <FormField type={ 'password' } labelText='Contraseña:' name={ 'login-password' } maxLength={ 6 } required />
            <Button type='submit' level='btn-primary'>Iniciar Sesión</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm