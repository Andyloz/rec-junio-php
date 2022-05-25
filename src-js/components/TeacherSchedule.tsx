import React, { FC } from 'react'
import ScheduleTable from './Tables/ScheduleTable'
import User from './shapes/User'
import UserType from './shapes/UserType'

interface IProps {
  user: User
  type: UserType
}

const TeacherSchedule: FC<IProps> = ({ user, type }) => {
  return (
    <section>
      <h3 className='mt-4 mt-sm-5 text-center'>Horario del profesor { user.nombre }</h3>
      <ScheduleTable user={user} type={type} />
    </section>
  )
}

export default TeacherSchedule