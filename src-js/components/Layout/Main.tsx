import React, { FC, ReactNode } from 'react'
import LoginForm from '../Forms/LoginForm'
import Dashboard from '../Dashboard'
import useSession from '../../hooks/useSession'

const Container: FC<{ children: ReactNode }> = ({ children }) => (
  <main className='flex-grow-1'>{ children }</main>
)

const Main = () => {
  const { user, msg, login, logout, clearMsg } = useSession()

  if (!user) return (
    <Container>
      <LoginForm
        msg={ msg }
        onPressedLogin={ login }
        onInputsChange={ clearMsg }
      />
    </Container>
  )

  return (
    <Container>
      <Dashboard
        user={ user }
        logout={ logout }
      />
    </Container>
  )
}

export default Main