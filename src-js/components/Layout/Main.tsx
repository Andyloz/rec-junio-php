import React, { useEffect, useState } from 'react'
import LoginForm from '../Forms/LoginForm'
import Dashboard from '../Dashboard'
import useApi from '../../hooks/useApi'
import User from '../shapes/User'

type SessionResponse = { user: User } | Record<'not-logged' | 'error' | 'forbidden' | 'time', string>
type LoginResponse = { user: User } | Record<'msg' | 'error', string>

const Main = () => {
  const { response: sessionResponse, doRequest: doSessionRequest } = useApi<SessionResponse>()
  const { response: loginResponse, doRequest: doLoginRequest } = useApi<LoginResponse>()
  const { response: logoutConfirm, doRequest: doLogoutRequest } = useApi<{ msg: string }>()

  const [user, setUser] = useState<User>()
  const [loginMessage, setLoginMessage] = useState<string>()
  const [errorMessage, setLoginError] = useState<string>()

  // session checking
  useEffect(() => {
    doSessionRequest('api/session-status')
    const interval = setInterval(
      () => doSessionRequest('api/session-status'), 60000,
    )
    return () => clearInterval(interval)
  }, [])

  // on session response change
  useEffect(() => {
    if (sessionResponse) {

      if ('time' in sessionResponse) {
        setLoginMessage(sessionResponse['time'])
      } else if ('forbidden' in sessionResponse) {
        setLoginMessage(sessionResponse['forbidden'])
      } else { // is User
        setUser(sessionResponse['user'])
      }

    }
  }, [sessionResponse])

  // on logout confirm change
  useEffect(() => {
    if (logoutConfirm && 'msg' in logoutConfirm) {
      setUser(undefined)
    }
  }, [logoutConfirm])


  // on login response change
  useEffect(() => {
    if (loginResponse) {

      if ('msg' in loginResponse) {
        setLoginMessage(loginResponse['msg'])
      } else if ('error' in loginResponse) {
        setLoginError(loginResponse['error'])
      } else { // is User
        setUser(loginResponse['user'])
      }

    }
  }, [loginResponse])

  const handleLogout = () => {
    doLogoutRequest('api/logout', {
      method: 'POST',
    })
  }

  const handleLoginPress = (fd: FormData) => {
    const data = Object.fromEntries(fd.entries())
    doLoginRequest('api/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  return (
    <main className='flex-grow-1'>
      {
        user
          ? <Dashboard user={ user } logout={ handleLogout } />
          : <LoginForm onPressedLogin={ handleLoginPress } message={ loginMessage } error={ errorMessage } />
      }
    </main>
  )
}

export default Main