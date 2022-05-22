import React from 'react'
import Button from '../Button'
import FormField from './FormField/FormField'

const LoginForm = () => {
  return (
    <form method="post">
      <FormField type={"text"} label="Usuario:" name={"login-username"} maxLength={20}/>
      <FormField type={"text"} label="Contraseña:" name={"login-password"} maxLength={6}/>
      <Button type="submit">Iniciar Sesión</Button>
    </form>
  )
}

export default LoginForm