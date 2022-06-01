import React, { FC, useEffect, useState } from 'react'
import UserType from './shapes/UserType'
import User from './shapes/User'
import UserSchedule from './UserSchedule'
import UserSelectorForm from './Forms/UserSelectorForm'
import WelcomeLayer from './WelcomeLayer'
import ScheduleInterval from './shapes/ScheduleInterval'
import ScheduleHourSummary from './ScheduleHourSummary'
import useSchedule from '../hooks/useSchedule'
import useGroups from '../hooks/useGroups'

interface IProp {
  user: User
  logout: () => void
}

export interface IntervalData {
  day: number,
  hour: number,
  user: User,
  interval?: ScheduleInterval
}

const Dashboard: FC<IProp> = ({ user, logout }) => {

  const { schedule, user: selectedUser, setUser: setSelectedUser, refreshData } = useSchedule()
  const { msg: groupMsg, removeMsg, ...groupsOp } = useGroups()

  const addGroup: typeof groupsOp.addGroup = (params) =>
    groupsOp.addGroup(params).then(refreshData)

  const rmGroup: typeof groupsOp.rmGroup = (params) =>
    groupsOp.rmGroup(params).then(refreshData)

  const [selectedIntervalData, setSelectedIntervalData] = useState<IntervalData>()

  useEffect(removeMsg, [selectedUser, selectedIntervalData])

  const scheduleHourSummary = !selectedIntervalData ? undefined : (
    <ScheduleHourSummary
      msg={ groupMsg }
      intervalData={ selectedIntervalData }
      onRmGroupPress={ rmGroup }
      onAddPressed={ addGroup }
    />
  )

  // noinspection JSUnusedGlobalSymbols
  const userScheduleProps =
    { schedule, refreshData, onEditPress: (iData: IntervalData) => setSelectedIntervalData(iData) }

  const adminContent = (
    <>
      <UserSelectorForm onSelectedUser={ u => setSelectedUser(u) } />
      { selectedUser && (
        <>
          <UserSchedule{ ...userScheduleProps } type={ UserType.Admin } user={ selectedUser } />
          { scheduleHourSummary }
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
          ? <UserSchedule { ...userScheduleProps } type={ UserType.Normal } user={ user } />
          : adminContent
      }
    </div>
  )
}

export default Dashboard
