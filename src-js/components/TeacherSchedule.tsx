import React, { FC } from 'react'
import ScheduleTable from './Tables/ScheduleTable'
import User from './shapes/User'
import UserType from './shapes/UserType'
import ScheduleInterval from './shapes/ScheduleInterval'

interface IProps {
  user: User
  type: UserType
  onEditPress?(interval: ScheduleInterval): void
}

const TeacherSchedule: FC<IProps> = ({ user, type, onEditPress }) => {
  return (
    <section>
      <h3 className='mt-4 mt-sm-5 text-center'>Horario del profesor { user.nombre }</h3>
      <ScheduleTable user={user} type={type} onEditPress={onEditPress} />
    </section>
  )
}

export default TeacherSchedule