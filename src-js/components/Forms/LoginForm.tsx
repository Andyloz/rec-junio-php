import React, { FC, FormEventHandler, useRef } from 'react'
import useMediaQuery from '../../hooks/useMediaQuery'
import FormField from './FormField'
import classNames from 'classnames'
import { Login, SessionMessage } from '../../hooks/useSession'

export interface LoginFormProps {
  msg?: SessionMessage
  onPressedLogin: (details: Login['Request']) => void
  onInputsChange: () => void
}

const LoginForm: FC<LoginFormProps> = ({ msg, onPressedLogin, onInputsChange }) => {

  const messageContainer = !msg ? undefined : (
    <div className='mt-2 mt-md-3 mx-4'>
      <div
        role='alert'
        className={ classNames(
          'alert',
          { 'alert-primary': msg.type === 'info' },
          { 'alert-danger': msg.type === 'error' },
          { 'alert-warning': msg.type === 'warning' },
        ) }
        children={ msg.content }
      />
    </div>
  )

  const titleSizeMatches = useMediaQuery('(max-width: 550px)')

  const title = (
    <div className='d-flex flex-column'>
      <h2 className='text-center'>
        <span className='display-1 d-md-none' style={ { fontSize: titleSizeMatches ? '50px' : undefined } }>
          Iniciar sesión
        </span>
        <span className='display-3 d-none d-md-block'>Iniciar sesión</span>
      </h2>
      { messageContainer }
    </div>
  )

  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (e.currentTarget.checkValidity()) onPressedLogin({
      username: usernameRef.current?.value as string,
      password: passwordRef.current?.value as string,
    })
  }

  const form = (
    <form className='card shadow-sm p-2' onSubmit={ handleSubmit }>
      <div className='card-body'>
        <FormField
          inputRef={ usernameRef } type={ 'text' } labelText='Usuario:' name={ 'username' } maxLength={ 20 }
          required onChange={ onInputsChange }
        />
        <FormField
          inputRef={ passwordRef } type={ 'password' } labelText='Contraseña:' name={ 'password' } maxLength={ 6 }
          required onChange={ onInputsChange }
        />
        <button type='submit' className='btn btn-primary'>Iniciar Sesión</button>
      </div>
    </form>
  )

  return (
    <div className='container h-100 d-flex'>
      <div className='m-auto d-flex flex-column flex-md-row align-items-center gap-3 gap-md-5'>
        { title }
        { form }
      </div>
    </div>
  )
}

export default LoginForm