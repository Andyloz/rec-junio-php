import React, { FC, ReactNode, useEffect, useState } from 'react'
import LoginForm from '../Forms/LoginForm'
import Dashboard from '../Dashboard'
import useApi, { useApi2 } from '../../hooks/useApi'
import User from '../shapes/User'

type SessionResponse = { user: User } | Record<'not-logged' | 'error' | 'forbidden' | 'time', string>
type LoginResponse = { user: User } | Record<'msg' | 'error', string>

const Container: FC<{ children: ReactNode }> = ({ children }) => (
  <main className='flex-grow-1'>{ children }</main>
)

const Main = () => {
  const { response: sessionResponse, doRequest: doSessionRequest } = useApi<SessionResponse>()
  const { response: loginResponse, doRequest: doLoginRequest } = useApi<LoginResponse>()
  const { response: logoutConfirm, doRequest: doLogoutRequest } = useApi<{ msg: string }>()

  const { doRequest: doSessionRequest2 } = useApi2('api/session-status')

  useEffect(() => {

  }, [])

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

  if (!user) return (
    <Container>
      <LoginForm
        onPressedLogin={ (fd) => {
          const data = Object.fromEntries(fd.entries())
          doLoginRequest('api/login', {
            method: 'POST',
            body: JSON.stringify(data),
          })
        } }
        message={ loginMessage }
        error={ errorMessage }
        hideMessage={ () => {
          setLoginMessage(undefined)
          setLoginError(undefined)
        } }
      />
    </Container>
  )

  return (
    <Container>
      <Dashboard
        user={ user }
        logout={ () => {
          doLogoutRequest('api/logout', {
            method: 'POST',
          })
        } }
      />
    </Container>
  )
}

export default Main