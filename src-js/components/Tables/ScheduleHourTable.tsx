import React, { FC } from 'react'
import ScheduleInterval from '../shapes/ScheduleInterval'
import useGroupsOp from '../../hooks/useGroupsOp'

export interface ScheduleHourTableProps {
  interval: ScheduleInterval | {}
  onRmGroupPress: ReturnType<typeof useGroupsOp>['rmGroup']
}

const ScheduleHourTable: FC<ScheduleHourTableProps> = ({ interval, onRmGroupPress }) => {
  const rows = 'groups' in interval
    ? interval.groups.map(group => (
      <tr key={ group.id }>
        <td className='text-center align-middle'>{ group.name } ({ interval.classroom?.name })</td>
        <td className='text-center'>
          <button
            className='btn btn-link p-0'
            onClick={ () => onRmGroupPress({ 'id-schedule': group.scheduleRowId }) }
            children={ 'Quitar' }
          />
        </td>
      </tr>
    ))
    : (
      <tr>
        <td></td>
        <td></td>
      </tr>
    )

  return (
    <div className='table-responsive w-50'>
      <table className='table table-bordered mt-4'>
        <thead className='table-primary'>
          <tr className='text-center'>
            <th scope='col'>Grupo (Aula)</th>
            <th scope='col'>Acción</th>
          </tr>
        </thead>
        <tbody>{ rows }</tbody>
      </table>
    </div>
  )
}

export default ScheduleHourTable