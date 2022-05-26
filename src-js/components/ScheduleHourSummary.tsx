import React, { FC } from 'react'
import HourAdditionForm from './Forms/HourAdditionForm'
import ScheduleHourTable from './Tables/ScheduleHourTable'
import User from './shapes/User'
import ScheduleInterval from './shapes/ScheduleInterval'

interface IProps {
  interval: ScheduleInterval
  user: User
}

const fHourIntervals: { [k: number]: string } = {
  1: '8:15 - 9:15',
  2: '9:15 - 10:15',
  3: '10:15 - 11:15',
  4: '11:15 - 11:45',
  5: '11:45 - 12:45',
  6: '12:45 - 13:45',
  7: '13:45 - 14:45',
}

const fDays: { [k: number]: string } = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
}

const ScheduleHourSummary: FC<IProps> = ({ interval, user }) => {
  return (
    <section className='mt-4'>
      <h3>Editando la { interval.hour }º hora ({ fHourIntervals[interval.hour] }) del { fDays[interval.day] }</h3>
      <ScheduleHourTable interval={interval} />
      <HourAdditionForm user={user} interval={interval} />
    </section>
  )
}

export default ScheduleHourSummary