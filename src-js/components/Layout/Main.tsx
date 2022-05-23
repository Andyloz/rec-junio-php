import React from 'react'
import LoginForm from '../Forms/LoginForm'
import TeacherSelectorForm from '../Forms/TeacherSelectorForm'
import TeacherSchedule from '../TeacherSchedule'
import WelcomeLayer from '../WelcomeLayer'

const Main = () => {
  return (
    <main className='container'>
      <LoginForm />
      <WelcomeLayer />
      <TeacherSelectorForm />
      <h2>Su horario</h2>
      <h2>Horario de los profesores</h2>
      <TeacherSchedule />
    </main>
  )
}

export default Main