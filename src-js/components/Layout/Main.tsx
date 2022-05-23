import React, { useState } from 'react'
import LoginForm from '../Forms/LoginForm'
import Dashboard from '../Dashboard'

const Main = () => {
  const [user, setUser] = useState<{}>()

  return (
    <main className='flex-grow-1'>
      {
        user
          ? <Dashboard />
          : <LoginForm
            onPressedLogin={
              (fd) => {
                const form = Object.fromEntries(fd.entries())
                console.log(form)
                setUser({})
              }
            } />
      }
    </main>
  )
}

export default Main