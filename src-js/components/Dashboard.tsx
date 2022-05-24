import React, { FC, useState } from 'react'
import UserType from './shapes/UserType'
import User from './shapes/User'
import TeacherSchedule from './TeacherSchedule'
import TeacherSelectorForm from './Forms/TeacherSelectorForm'

interface IProp {
  user: User
}

const Dashboard: FC<IProp> = ({ user }) => {
  const [selectedTeacher, setSelectedTeacher] = useState<User | undefined>()
  const handleTeacherSelect = (teacher: User) => setSelectedTeacher(teacher)

  return (
    <div className='container'>
      <h1 className='mt-5'>Dashboard</h1>
      { user.tipo === UserType.Normal && <TeacherSchedule user={ user } /> || (
          <>
            <TeacherSelectorForm onPressedSubmit={handleTeacherSelect} />
            { selectedTeacher && <TeacherSchedule user={ selectedTeacher } /> }
          </>
        ) }
    </div>
  )
}

export default Dashboard
