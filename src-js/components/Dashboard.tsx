import React, {FC, useEffect, useState} from 'react'
import UserType from './shapes/UserType'
import User from './shapes/User'
import TeacherSchedule from './TeacherSchedule'
import TeacherSelectorForm from './Forms/TeacherSelectorForm'
import WelcomeLayer from './WelcomeLayer'
import ScheduleInterval from './shapes/ScheduleInterval'
import ScheduleHourSummary from './ScheduleHourSummary'
import {useApi2With} from '../hooks/useApi'
import Message from "./shapes/Message";

interface IProp {
  user: User
  logout: () => void
}

type RmGroupDetails = { 'id-schedule': number }
type AddGroupDetails = { day: number, hour: number, 'id-user': number, 'id-group': number, 'id-classroom': number }

type GroupResponse = Record<'msg' | 'error' | 'success-msg', string>

const Dashboard: FC<IProp> = ({ user, logout }) => {

  const [selectedTeacher, setSelectedTeacher] = useState<User>()
  const [selectedIntervalData, setSelectedIntervalData] =
    useState<{ day: number, hour: number, user: User, interval?: ScheduleInterval }>()
  const [hourFormMessage, setHourFormMessage] = useState<Message<'info' | 'error' | 'warning'>>()

  const { doRequest: doRmGroupRequest2 } =
    useApi2With.bodyParams<RmGroupDetails, GroupResponse>
    ('api/remove-group-in-hour', { method: 'DELETE' })
  const { doRequest: doAddGroupRequest2 } =
    useApi2With.bodyParams<AddGroupDetails, GroupResponse>('api/insert-group-in-hour')

  const isAdmin = user.tipo === UserType.Admin

  useEffect(() => {
    setSelectedIntervalData(undefined)
  }, [selectedTeacher])

  const handleTeacherSelect = (teacher: User) => setSelectedTeacher(teacher)

  const handleEditPress = (day: number, hour: number, user: User, interval?: ScheduleInterval) => {
    setHourFormMessage(undefined)
    setSelectedIntervalData({ day, hour, user, interval })
  }

  const handleRmGroupPress = (id: number) => {
    doRmGroupRequest2({ 'id-schedule': id }).then((res) => {
      if (!res) {
        return
      }
      setGroupActionMessage(res)
    })
  }

  const handleAddPressed = (details: AddGroupDetails) => {
    doAddGroupRequest2(details).then((res) => {
      if (!res) {
        return
      }
      setGroupActionMessage(res)
    })
  }

  const setGroupActionMessage = (res: GroupResponse) => {
    if (res['msg']) {
      setHourFormMessage({ content: res['msg'], type: 'warning' })
    } else if (res['error']) {
      setHourFormMessage({ content: res['error'], type: 'error' })
    } else {  // Success
      setHourFormMessage({ content: res['success-msg'], type: 'info' })
    }
  }

  return (
    <div className='container mb-5'>
      <h1 className='mt-5'>Dashboard</h1>
      <WelcomeLayer user={ user } onPressedLogout={ logout }/>
      {
        !isAdmin
          ? <TeacherSchedule user={ user } type={ UserType.Normal } onEditPress={ handleEditPress }/>
          : (
            <>
              <TeacherSelectorForm onShowSchedulePressed={ handleTeacherSelect }/>
              { selectedTeacher && (
                <>
                  <TeacherSchedule user={ selectedTeacher } type={ UserType.Admin } onEditPress={ handleEditPress }/>
                  {
                    selectedIntervalData &&
                      <ScheduleHourSummary
                          intervalData={ selectedIntervalData }
                          onRmGroupPress={ handleRmGroupPress }
                          onAddPressed={ handleAddPressed }
                          msg={ hourFormMessage }
                      />
                  }
                </>
              ) }
            </>
          )
      }
    </div>
  )
}

export default Dashboard
