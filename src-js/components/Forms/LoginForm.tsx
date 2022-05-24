import React, { FC, FormEventHandler } from 'react'
import Button from '../Button'
import FormField from './FormField/FormField'
import useMediaQuery from '../../hooks/useMediaQuery'

interface IProps {
  message?: string
  error?: string
  onPressedLogin: (data: FormData) => void
}

const LoginForm: FC<IProps> = ({ message, error, onPressedLogin }) => {

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (e.currentTarget.checkValidity()) {
      const formData = new FormData(e.currentTarget)
      onPressedLogin(formData)
    }
  }

  const displayError = typeof error === 'string'
  const displayMessage = typeof message === 'string'
  const showAnyMessage = displayError || displayMessage
  const titleSizeMatches = useMediaQuery('(max-width: 550px)')

  return (
    <div className='container h-100 d-flex'>
      <div className='m-auto d-flex flex-column flex-md-row align-items-center gap-3 gap-md-5'>
        <div className='d-flex flex-column'>
          <h2 className='text-center'>
            <span className='display-1 d-md-none' style={ { fontSize: titleSizeMatches ? '50px' : undefined } }>Iniciar sesión</span>
            <span className='display-3 d-none d-md-block'>Iniciar sesión</span>
          </h2>
          {
            showAnyMessage &&
            <div className='mt-2 mt-md-3 mx-4'>
              { displayError && <div className='alert alert-danger' role='alert'>{ error }</div> }
              { displayMessage && <div className='alert alert-warning' role='alert'>{ message }</div> }
            </div>
          }
        </div>
        <form className='card shadow-sm p-2' onSubmit={ handleSubmit }>
          <div className='card-body'>
            <FormField type={ 'text' } labelText='Usuario:' name={ 'username' } maxLength={ 20 } required />
            <FormField type={ 'password' } labelText='Contraseña:' name={ 'password' } maxLength={ 6 } required />
            <Button type='submit' level='btn-primary'>Iniciar Sesión</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm