import React, { FC, useEffect, useState } from 'react'
import UserType from './shapes/UserType'
import User from './shapes/User'
import UserSchedule, { UserScheduleProps } from './UserSchedule'
import UserSelectorForm from './Forms/UserSelectorForm'
import WelcomeLayer from './WelcomeLayer'
import ScheduleInterval from './shapes/ScheduleInterval'
import ScheduleHourSummary from './ScheduleHourSummary'
import { useFetchWith } from '../hooks/useFetch'
import Message from './shapes/Message'
import { HourAdditionFormProps } from './Forms/HourAdditionForm'

interface IProp {
  user: User
  logout: () => void
}

export type RmGroupDetails = { 'id-schedule': number }
export type AddGroupDetails = { day: number, hour: number, 'id-user': number, 'id-group': number, 'id-classroom': number }

export type HourFormMessage = Message<'info' | 'error' | 'warning'>
export type GroupResponse = Record<'msg' | 'error' | 'success-msg', string>

export interface IntervalData {
  day: number,
  hour: number,
  user: User,
  interval?: ScheduleInterval
}

const Dashboard: FC<IProp> = ({ user, logout }) => {

  const [hourFormMessage, setHourFormMessage] = useState<HourFormMessage>()

  const { doRequest: removeGroup } = useFetchWith.bodyParams<RmGroupDetails, GroupResponse>(
    'api/remove-group-in-hour', { method: 'DELETE' },
  )
  const { doRequest: addGroup } = useFetchWith.bodyParams<AddGroupDetails, GroupResponse>(
    'api/insert-group-in-hour',
  )

  const setGroupActionMessage = (res: GroupResponse) => {
    if ('msg' in res) {
      setHourFormMessage({ content: res['msg'], type: 'warning' })
    } else if ('error' in res) {
      setHourFormMessage({ content: res['error'], type: 'error' })
    } else {  // success
      setHourFormMessage({ content: res['success-msg'], type: 'info' })
    }
  }

  const handleRmGroupPress = (id: number) => {
    removeGroup({ 'id-schedule': id })
      .then(res => setGroupActionMessage(res))
  }

  const handleAddPressed: HourAdditionFormProps['onAddPressed'] = (details) => {
    addGroup(details)
      .then(res => setGroupActionMessage(res))
  }

  const [selectedUser, setSelectedUser] = useState<User>()
  const [selectedIntervalData, setSelectedIntervalData] = useState<IntervalData>()

  useEffect(() => setSelectedIntervalData(undefined), [selectedUser, selectedIntervalData])

  const scheduleHourSummary = !selectedIntervalData ? undefined : (
    <ScheduleHourSummary
      intervalData={ selectedIntervalData }
      onRmGroupPress={ handleRmGroupPress }
      onAddPressed={ handleAddPressed }
      msg={ hourFormMessage }
    />
  )

  const handleEditPress: UserScheduleProps['onEditPress'] = (iData) => {
    setHourFormMessage(undefined)
    setSelectedIntervalData(iData)
  }

  const adminContent = (
    <>
      <UserSelectorForm onSelectedUser={ u => setSelectedUser(u) } />
      { selectedUser && (
        <>
          <UserSchedule user={ selectedUser } type={ UserType.Admin } onEditPress={ handleEditPress } />
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
          ? <UserSchedule user={ user } type={ UserType.Normal } onEditPress={ handleEditPress } />
          : adminContent
      }
    </div>
  )
}

export default Dashboard
