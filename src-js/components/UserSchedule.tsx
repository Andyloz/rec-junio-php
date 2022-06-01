import React, { FC } from 'react'
import ScheduleTable, { OnEditPress } from './Tables/ScheduleTable'
import User from './shapes/User'
import UserType from './shapes/UserType'
import Schedule from './shapes/Schedule'

export interface UserScheduleProps {
  type: UserType
  schedule: Schedule
  user: User
  selectInterval: OnEditPress
}

const UserSchedule: FC<UserScheduleProps> = ({ schedule, user, type, selectInterval }) => {
  return (
    <section>
      <h3 className='mt-4 mt-sm-5 text-center'>Horario del profesor { user.nombre }</h3>
      <ScheduleTable
        schedule={schedule}
        type={ type }
        selectInterval={ selectInterval }
      />
    </section>
  )
}

export default UserSchedule