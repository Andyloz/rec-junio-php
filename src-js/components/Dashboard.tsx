import React, { FC, useState } from 'react'
import UserType from './shapes/UserType'
import User from './shapes/User'
import TeacherSchedule from './TeacherSchedule'

interface IProp {
  user: User
}

const Dashboard: FC<IProp> = ({ user }) => {
  const [teacherId, setTeacherId] = useState<number | undefined>(
    user.tipo === UserType.Admin ? undefined : user.id_usuario,
  )

  return (
    <div className='container'>
      <h1>Dashboard</h1>
      <TeacherSchedule user={ user } />
    </div>
  )
}

export default Dashboard
