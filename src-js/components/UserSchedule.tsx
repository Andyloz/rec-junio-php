import React, { FC } from 'react'
import ScheduleTable, { OnEditPress } from './Tables/ScheduleTable'
import User from './shapes/User'
import UserType from './shapes/UserType'
import Schedule from './shapes/Schedule'

export interface UserScheduleProps {
  type: UserType
  schedule?: Schedule
  user: User
  refreshData: () => void
  onEditPress: OnEditPress
}

const UserSchedule: FC<UserScheduleProps> = ({ schedule, user, refreshData, type, onEditPress }) => {
  return (
    <section>
      <h3 className='mt-4 mt-sm-5 text-center'>Horario del profesor { user.nombre }</h3>
      <ScheduleTable
        schedule={schedule}
        user={ user }
        refreshData={refreshData}
        type={ type }
        onEditPress={ onEditPress }
      />
    </section>
  )
}

export default UserSchedule