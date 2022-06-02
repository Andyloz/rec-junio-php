import React, { FC, useEffect, useState } from 'react'
import UserType from './shapes/UserType'
import User from './shapes/User'
import UserSchedule from './UserSchedule'
import UserSelectorForm from './Forms/UserSelectorForm'
import WelcomeLayer from './WelcomeLayer'
import ScheduleHourSummary from './ScheduleHourSummary'
import useSchedule from '../hooks/useSchedule'
import useGroupsOp from '../hooks/useGroupsOp'

interface IProp {
  user: User
  logout: () => void
}

export interface SelectedInterval {
  day: number
  hour: number
}

const Dashboard: FC<IProp> = ({ user, logout }) => {

  const { schedule, user: selectedUser, setUser: selectUser, refreshData } = useSchedule()
  useEffect(() => {
    if (selectedUser) {
      refreshData()
    } else if (user.tipo === UserType.Normal) {
      selectUser(user)
    }
  }, [selectedUser])

  const { msg: groupMsg, removeMsg, ...groupsOp } = useGroupsOp()

  const addGroup: typeof groupsOp.addGroup = (params) => groupsOp.addGroup(params).then(refreshData)
  const rmGroup: typeof groupsOp.rmGroup = (params) => groupsOp.rmGroup(params).then(refreshData)

  const [selectedInterval, selectInterval] = useState<SelectedInterval>()

  useEffect(() => {
    selectInterval(undefined)
    removeMsg()
  }, [selectedUser])

  useEffect(() => {
    removeMsg()
  }, [selectedInterval])

  const adminContent = (
    <>
      <UserSelectorForm onSelectedUser={ selectUser } />
      { selectedUser && schedule && (
        <>
          <UserSchedule
            selectInterval={ selectInterval }
            type={ UserType.Admin }
            schedule={ schedule }
            user={ selectedUser }
          />
          { selectedInterval &&
            <ScheduleHourSummary
              { ...selectedInterval }
              user={ selectedUser }
              msg={ groupMsg }
              interval={ schedule[selectedInterval.day][selectedInterval.hour] }
              onRmGroupPress={ rmGroup }
              onAddPressed={ addGroup }
            /> }
        </>
      ) }
    </>
  )

  return (
    <div className='container mb-5'>
      <h1 className='mt-5'>Dashboard</h1>
      <WelcomeLayer user={ user } onPressedLogout={ logout } />
      {
        user.tipo === UserType.Normal
          ? schedule &&
          <UserSchedule
            selectInterval={ selectInterval }
            type={ UserType.Normal }
            schedule={ schedule }
            user={ user }
          />
          : adminContent
      }
    </div>
  )
}

export default Dashboard
