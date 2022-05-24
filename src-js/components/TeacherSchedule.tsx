import React, { FC } from 'react'
import ScheduleTable from './Tables/ScheduleTable'
import User from './shapes/User'

interface IProps {
  user: User
}

const TeacherSchedule: FC<IProps> = ({ user }) => {
  return (
    <section>
      <h3 className='mt-5'>Horario del profesor { user.nombre }</h3>
      <ScheduleTable />
    </section>
  )
}

export default TeacherSchedule