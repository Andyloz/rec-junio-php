import { useApi, useApiWith } from './useApi'
import User from '../components/shapes/User'
import { useEffect, useRef, useState } from 'react'
import Message from '../components/shapes/Message'

export interface Login {
  Request: { username: string, password: string }
  Response: { user: User }
    | { msg: string } | { error: string }
}

export interface Session {
  Response: { user: User }
    | { 'not-logged': string } | { 'error': string } | { 'forbidden': string } | { 'time': string }
}

export interface Logout {
  Response: { msg: string }
}

function useSession() {
  const { doRequest: doLoginRequest } = useApiWith.bodyParams<Login['Request'], Login['Response']>('api/login')
  const { doRequest: doSessionRequest } = useApi<Session['Response']>('api/session-status')
  const { doRequest: doLogoutRequest } = useApi<Logout>('api/logout', { method: 'POST' })

  const [user, setUser] = useState<User>()
  const [msg, setMsg] = useState<Message<'info' | 'warning' | 'error'>>()
  const sessionInterval = useRef<number>()

  const sessionClear =
    () => {
      setUser(undefined)
      clearInterval(sessionInterval.current)
      sessionInterval.current = undefined
    }

  const sessionCheck =
    () => {
      doSessionRequest().then(res => {
        if ('user' in res) {
          setUser(res['user'])
        } else {
          sessionClear()
          if ('time' in res) {
            setMsg({ content: res['time'], type: 'info' })
          } else if ('forbidden' in res) {
            setMsg({ content: res['forbidden'], type: 'error' })
          }
        }
      })
    }

  useEffect(() => {
    sessionCheck()
    sessionInterval.current = window.setInterval(sessionCheck, 60000)
    return sessionClear
  }, [])

  const login = (credentials: Login['Request']) => {
    setMsg(undefined)
    doLoginRequest(credentials).then(res => {
      if ('msg' in res) {
        setMsg({ content: res['msg'], type: 'warning' })
      } else if ('error' in res) {
        setMsg({ content: res['error'], type: 'error' })
      } else { // user
        setUser(res['user'])
      }
    })
  }

  const logout = () => doLogoutRequest()
    .then(() => setUser(undefined))

  const clearMsg = () => setMsg(undefined)

  return { user, msg, login, logout, clearMsg }
}

export default useSession
