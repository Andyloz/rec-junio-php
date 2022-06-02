import React, { FC } from 'react'
import HourAdditionForm from './Forms/HourAdditionForm'
import ScheduleHourTable from './Tables/ScheduleHourTable'
import classNames from 'classnames'
import useGroupsOp, { GroupActionMsg } from '../hooks/useGroupsOp'
import ScheduleInterval from './shapes/ScheduleInterval'
import User from './shapes/User'
import useClassroomsGroups from '../hooks/useClassesGroups'
import { fDays, fHourIntervals, fHours } from '../formattedIntervals'

interface IProps {
  msg?: GroupActionMsg
  user: User
  day: number
  hour: number
  interval: ScheduleInterval | {}
  groups: Exclude<ReturnType<typeof useClassroomsGroups>['groups'], undefined>
  classrooms: Exclude<ReturnType<typeof useClassroomsGroups>['classrooms'], undefined>
  onRmGroupPress: ReturnType<typeof useGroupsOp>['rmGroup']
  onAddPressed: ReturnType<typeof useGroupsOp>['addGroup']
}

const ScheduleHourSummary: FC<IProps> = (
  {
    day, hour,
    user, interval,
    groups, classrooms,
    onRmGroupPress, onAddPressed,
    msg
  }
) => {
  const titleContent = `Editando la ${ fHours[hour] } (${ fHourIntervals[hour] }) del ${ fDays[day] }`

  return (
    <section className='mt-4'>
      <h3>{ titleContent }</h3>
      <ScheduleHourTable interval={ interval } onRmGroupPress={ onRmGroupPress } />
      <HourAdditionForm
        day={ day } hour={ hour }
        user={ user } interval={ interval }
        groups={groups} classrooms={classrooms}
        onAddPressed={ onAddPressed }
      />
      { msg &&
        <div
          role='alert'
          className={ classNames(
            'mt-3', 'd-inline-block', 'alert',
            { 'alert-primary': msg.type === 'info' },
            { 'alert-danger': msg.type === 'error' },
            { 'alert-warning': msg.type === 'warning' },
          ) }
          children={ msg.content }
        />
      }
    </section>
  )
}

export default ScheduleHourSummary