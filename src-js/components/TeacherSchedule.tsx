import React, { FC } from 'react'
import ScheduleTable from './Tables/ScheduleTable'
import User from './shapes/User'

interface IProps {
  user: User
}

const TeacherSchedule: FC<IProps> = ({ user }) => {
  return (
    <section>
      <h3 className='mt-4 mt-sm-5'>Horario del profesor { user.nombre }</h3>
      <ScheduleTable user={user} />
    </section>
  )
}

export default TeacherSchedule