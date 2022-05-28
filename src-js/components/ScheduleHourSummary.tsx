import React, { FC } from 'react'
import HourAdditionForm from './Forms/HourAdditionForm'
import ScheduleHourTable from './Tables/ScheduleHourTable'
import ScheduleInterval from './shapes/ScheduleInterval'
import User from './shapes/User'

interface IProps {
  message?: { msg: string, className: string }
  intervalData: { day: number, hour: number, user: User, interval?: ScheduleInterval }
  onRmGroupPress: (id: number) => void
  onAddPressed: (details: {day: number, hour: number, userId: number, groupId: number, classroomId: number}) => void
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

const fHours: { [k: number]: string } = {
  1: '1º hora',
  2: '2º hora',
  3: '3º hora',
  5: '4º hora',
  6: '5º hora',
  7: '6º hora',
}

const fDays: { [k: number]: string } = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
}

const ScheduleHourSummary: FC<IProps> = ({ intervalData, onRmGroupPress, onAddPressed, message }) => {
  return (
    <section className='mt-4'>
      <h3>Editando la { fHours[intervalData.hour] } ({ fHourIntervals[intervalData.hour] }) del { fDays[intervalData.day] }</h3>
      <ScheduleHourTable intervalData={ intervalData } onRmGroupPress={ onRmGroupPress } />
      <HourAdditionForm intervalData={ intervalData } onAddPressed={ onAddPressed } />
      { message && <div className={ 'mt-3 alert ' + message.className } role='alert'>{ message.msg }</div> }
    </section>
  )
}

export default ScheduleHourSummary