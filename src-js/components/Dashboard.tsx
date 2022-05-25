import React, { FC, useState } from 'react'
import UserType from './shapes/UserType'
import User from './shapes/User'
import TeacherSchedule from './TeacherSchedule'
import TeacherSelectorForm from './Forms/TeacherSelectorForm'
import WelcomeLayer from './WelcomeLayer'

interface IProp {
  user: User
  logout: () => void
}

const Dashboard: FC<IProp> = ({ user, logout }) => {
  const [selectedTeacher, setSelectedTeacher] = useState<User | undefined>()
  const handleTeacherSelect = (teacher: User) => setSelectedTeacher(teacher)

  return (
    <div className='container'>
      <h1 className='mt-5'>Dashboard</h1>
      <WelcomeLayer user={ user } onPressedLogout={ logout } />
      { user.tipo === UserType.Normal && <TeacherSchedule user={ user } type={ user.tipo } /> || (
        <>
          <TeacherSelectorForm onPressedSubmit={ handleTeacherSelect } />
          { selectedTeacher && <TeacherSchedule user={ selectedTeacher } type={ user.tipo } /> }
        </>
      ) }
    </div>
  )
}

export default Dashboard
