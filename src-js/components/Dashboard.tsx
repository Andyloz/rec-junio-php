import React, { FC, useEffect, useState } from 'react'
import UserType from './shapes/UserType'
import User from './shapes/User'
import TeacherSchedule from './TeacherSchedule'
import TeacherSelectorForm from './Forms/TeacherSelectorForm'
import WelcomeLayer from './WelcomeLayer'
import ScheduleInterval from './shapes/ScheduleInterval'
import ScheduleHourSummary from './ScheduleHourSummary'

interface IProp {
  user: User
  logout: () => void
}

const Dashboard: FC<IProp> = ({ user, logout }) => {
  const [selectedTeacher, setSelectedTeacher] = useState<User>()
  const [selectedInterval, setSelectedInterval] = useState<ScheduleInterval>()
  const isAdmin = user.tipo === UserType.Admin

  useEffect(() => {
    setSelectedInterval(undefined)
  }, [selectedTeacher])

  const handleTeacherSelect = (teacher: User) => setSelectedTeacher(teacher)

  const handleEditPress = (interval: ScheduleInterval) => {
    setSelectedInterval(interval)
  }

  return (
    <div className='container mb-5'>
      <h1 className='mt-5'>Dashboard</h1>
      <WelcomeLayer user={ user } onPressedLogout={ logout } />
      {
        !isAdmin
          ? <TeacherSchedule user={ user } type={ UserType.Normal } />
          : (
            <>
              <TeacherSelectorForm onPressedSubmit={ handleTeacherSelect } />
              { selectedTeacher && (
                <>
                  <TeacherSchedule user={ selectedTeacher } type={ UserType.Admin } onEditPress={ handleEditPress } />
                  { selectedInterval && <ScheduleHourSummary interval={ selectedInterval } user={ selectedTeacher } /> }
                </>
              ) }
            </>
          )
      }
    </div>
  )
}

export default Dashboard
