import React, { useEffect, useState } from 'react'
import LoginForm from '../Forms/LoginForm'
import Dashboard from '../Dashboard'
import useApi from '../../hooks/useApi'
import Message from '../shapes/Message'
import User from '../shapes/User'
import Error from '../shapes/Error'

const Main = () => {
  const { response, doRequest } = useApi<{ user: User } | Error | Message>()
  const [user, setUser] = useState<{}>()
  const [loginMessage, setLoginMessage] = useState<string>()
  const [errorMessage, setLoginError] = useState<string>()

  useEffect(() => {
    if (response) {

      if ('msg' in response) {
        setLoginMessage(response.msg)
      } else if ('error' in response) {
        setLoginError(response.error)
      } else { // is User
        setUser(response.user)
      }

    }
  }, [response])

  const handleLoginPress = (fd: FormData) => {
    const data = Object.fromEntries(fd.entries())
    doRequest('api/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  return (
    <main className='flex-grow-1'>
      {
        user
          ? <Dashboard />
          : <LoginForm onPressedLogin={ handleLoginPress } message={ loginMessage } error={ errorMessage } />
      }
    </main>
  )
}

export default Main