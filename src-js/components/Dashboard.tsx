import React, { FC, useEffect, useState } from 'react'
import UserType from './shapes/UserType'
import User from './shapes/User'
import TeacherSchedule from './TeacherSchedule'
import TeacherSelectorForm from './Forms/TeacherSelectorForm'
import WelcomeLayer from './WelcomeLayer'
import ScheduleInterval from './shapes/ScheduleInterval'
import ScheduleHourSummary from './ScheduleHourSummary'
import useApi from '../hooks/useApi'

interface IProp {
  user: User
  logout: () => void
}

type rmGroupResponse = Record<'msg' | 'error' | 'success-msg', string>
type addGroupResponse = Record<'msg' | 'error' | 'success-msg', string>

const Dashboard: FC<IProp> = ({ user, logout }) => {
  const [selectedTeacher, setSelectedTeacher] = useState<User>()
  const [selectedIntervalData, setSelectedIntervalData] = useState<{ day: number, hour: number, user: User, interval?: ScheduleInterval }>()
  const [hourFormMessage, setHourFormMessage] = useState<{ msg: string, className: string }>()
  const { response: rmGroupResponse, doRequest: doRmGroupRequest } = useApi<rmGroupResponse>()
  const { response: addGroupResponse, doRequest: doAddGroupRequest } = useApi<addGroupResponse>()

  const isAdmin = user.tipo === UserType.Admin

  useEffect(() => {
    setSelectedIntervalData(undefined)
  }, [selectedTeacher])

  useEffect(() => {
    if (rmGroupResponse) {
      if (rmGroupResponse['msg']) {
        setHourFormMessage({ msg: rmGroupResponse['msg'], className: 'alert-warning' })
      } else if (rmGroupResponse['error']) {
        setHourFormMessage({ msg: rmGroupResponse['error'], className: 'alert-error' })
      } else {  // Success
        setHourFormMessage({ msg: rmGroupResponse['success-msg'], className: 'alert-info' })
      }
    }
  }, [rmGroupResponse])

  useEffect(() => {
    if (addGroupResponse) {
      if (addGroupResponse['msg']) {
        setHourFormMessage({ msg: addGroupResponse['msg'], className: 'alert-warning' })
      } else if (addGroupResponse['error']) {
        setHourFormMessage({ msg: addGroupResponse['error'], className: 'alert-error' })
      } else {  // Success
        setHourFormMessage({ msg: addGroupResponse['success-msg'], className: 'alert-info' })
      }
    }
  }, [addGroupResponse])

  const handleTeacherSelect = (teacher: User) => setSelectedTeacher(teacher)

  const handleEditPress = (day: number, hour: number, user: User, interval?: ScheduleInterval) => {
    setHourFormMessage(undefined)
    setSelectedIntervalData({ day, hour, user, interval })
  }

  const handleRmGroupPress = (id: number) => {
    const data = {
      'id-schedule': id,
    }

    doRmGroupRequest('api/remove-group-in-hour', {
      method: 'DELETE',
      body: JSON.stringify(data),
    })
  }

  const handleAddPressed = (fd: FormData) => {
    const data = Object.fromEntries(fd.entries())
    doAddGroupRequest('api/insert-group-in-hour', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  return (
    <div className='container mb-5'>
      <h1 className='mt-5'>Dashboard</h1>
      <WelcomeLayer user={ user } onPressedLogout={ logout } />
      {
        !isAdmin
          ? <TeacherSchedule user={ user } type={ UserType.Normal } onEditPress={handleEditPress} />
          : (
            <>
              <TeacherSelectorForm onPressedSubmit={ handleTeacherSelect } />
              { selectedTeacher && (
                <>
                  <TeacherSchedule user={ selectedTeacher } type={ UserType.Admin } onEditPress={ handleEditPress } />
                  {
                    selectedIntervalData &&
                    <ScheduleHourSummary
                      intervalData={ selectedIntervalData }
                      onRmGroupPress={ handleRmGroupPress }
                      onAddPressed={ handleAddPressed }
                      message={ hourFormMessage }
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
