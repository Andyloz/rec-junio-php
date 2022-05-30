import React, { FC } from 'react'
import ScheduleTable, { ScheduleTableProps } from './Tables/ScheduleTable'
import User from './shapes/User'
import UserType from './shapes/UserType'

export interface UserScheduleProps {
  user: User
  type: UserType
  onEditPress: ScheduleTableProps['onEditPress']
}

const UserSchedule: FC<UserScheduleProps> = ({ user, type, onEditPress }) => {
  return (
    <section>
      <h3 className='mt-4 mt-sm-5 text-center'>Horario del profesor { user.nombre }</h3>
      <ScheduleTable user={ user } type={ type } onEditPress={ onEditPress } />
    </section>
  )
}

export default UserSchedule