import React from 'react'
import LoginForm from '../Forms/LoginForm'
import TeacherSelectorForm from '../Forms/TeacherSelectorForm'
import WelcomeLayer from '../WelcomeLayer'

const Main = () => {
  return (
    <main className="container px-3">
      <h2 className="mb-3 mt-5 text-center text-sm-start">Iniciar Sesión</h2>
      <LoginForm/>
      <WelcomeLayer/>
      <TeacherSelectorForm/>
    </main>
  )
}

export default Main