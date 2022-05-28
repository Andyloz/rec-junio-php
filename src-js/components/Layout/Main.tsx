import React, {FC, ReactNode, useEffect, useRef, useState} from 'react'
import LoginForm from '../Forms/LoginForm'
import Dashboard from '../Dashboard'
import {useApi2, useApi2With} from '../../hooks/useApi'
import User from '../shapes/User'
import ApiMessage from '../shapes/ApiMessage'
import Message from '../shapes/Message'

type LoginDetails = { username: string, password: string }
type LoginResponse = { user: User } | Record<'msg' | 'error', string>
type SessionResponse = { user: User } | Record<'not-logged' | 'error' | 'forbidden' | 'time', string>

const Container: FC<{ children: ReactNode }> = ({ children }) => (
  <main className='flex-grow-1'>{ children }</main>
)

const Main = () => {
  const { doRequest: doSessionRequest } = useApi2<SessionResponse>('api/session-status')
  const { doRequest: doLoginRequest } = useApi2With.bodyParams<LoginDetails, LoginResponse>('api/login')
  const { doRequest: doLogoutRequest } = useApi2<ApiMessage>('api/logout', { method: 'POST' })

  const [user, setUser] = useState<User>()
  const [loginMessage, setLoginMessage] = useState<Message<'info' | 'error' | 'warning'>>()

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

  const handleLoginPress = (details: LoginDetails) => {
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