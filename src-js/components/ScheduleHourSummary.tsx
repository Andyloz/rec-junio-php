import React, { FC } from 'react'
import HourAdditionForm, { HourAdditionFormProps } from './Forms/HourAdditionForm'
import ScheduleHourTable, { ScheduleHourTableProps } from './Tables/ScheduleHourTable'
import classNames from 'classnames'
import { HourFormMessage, IntervalData } from './Dashboard'

interface IProps {
  msg?: HourFormMessage
  intervalData: IntervalData
  onRmGroupPress: ScheduleHourTableProps['onRmGroupPress']
  onAddPressed: HourAdditionFormProps['onAddPressed']
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

const ScheduleHourSummary: FC<IProps> = ({ intervalData, onRmGroupPress, onAddPressed, msg }) => {
  const titleContent =
    `Editando la ${ fHours[intervalData.hour] } (${ fHourIntervals[intervalData.hour] }) del ${ fDays[intervalData.day] }`

  return (
    <section className='mt-4'>
      <h3>{ titleContent }</h3>
      <ScheduleHourTable intervalData={ intervalData } onRmGroupPress={ onRmGroupPress } />
      <HourAdditionForm intervalData={ intervalData } onAddPressed={ onAddPressed } />
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