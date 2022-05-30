import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import LoginForm, { LoginFormProps } from '../Forms/LoginForm'
import Dashboard from '../Dashboard'
import { useApi, useApiWith } from '../../hooks/useApi'
import User from '../shapes/User'

export type LoginDetails = { username: string, password: string }
export type LoginResponse = { user: User } | Record<'msg' | 'error', string>
export type SessionResponse = { user: User } | Record<'not-logged' | 'error' | 'forbidden' | 'time', string>

const Container: FC<{ children: ReactNode }> = ({ children }) => (
  <main className='flex-grow-1'>{ children }</main>
)

const Main = () => {
  const { doRequest: doSessionRequest } = useApi<SessionResponse>('api/session-status')
  const { doRequest: doLoginRequest } = useApiWith.bodyParams<LoginDetails, LoginResponse>('api/login')
  const { doRequest: doLogoutRequest } = useApi<{ msg: string }>('api/logout', { method: 'POST' })

  const [user, setUser] = useState<User>()
  const [loginMessage, setLoginMessage] = useState<LoginFormProps['msg']>()

  const sessionInterval = useRef<number | undefined>(undefined)

  const refreshSession = () => {
    doSessionRequest().then(res => {
      if ('time' in res) {
        setLoginMessage({ content: res['time'], type: 'info' })
      } else if ('forbidden' in res) {
        setLoginMessage({ content: res['forbidden'], type: 'error' })
      } else { // is User
        setUser(res['user'])
      }
    })
  }

  const clearSessionInterval = () => {
    window.clearInterval(sessionInterval.current)
    sessionInterval.current = undefined
  }

  useEffect(() => {
    refreshSession()
    sessionInterval.current = window.setInterval(refreshSession, 60000)
    return clearSessionInterval
  }, [])

  const handleLoginPress: LoginFormProps['onPressedLogin'] = (details) => {
    doLoginRequest(details).then(loginRes => {
      if ('msg' in loginRes) {
        setLoginMessage({ content: loginRes['msg'], type: 'warning' })
      } else if ('error' in loginRes) {
        setLoginMessage({ content: loginRes['error'], type: 'error' })
      } else { // is User
        setUser(loginRes['user'])
      }
    })
  }

  if (!user) return (
    <Container>
      <LoginForm
        msg={ loginMessage }
        onPressedLogin={ handleLoginPress }
        onInputsChange={ () => setLoginMessage(undefined) }
      />
    </Container>
  )

  const handleLogoutPress = () => {
    doLogoutRequest().then((res) => {
      if ('msg' in res) setUser(undefined)
    })
  }

  return (
    <Container>
      <Dashboard
        user={ user }
        logout={ handleLogoutPress }
      />
    </Container>
  )
}

export default Main