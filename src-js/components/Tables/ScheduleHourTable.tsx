import React, { FC } from 'react'
import ScheduleInterval from '../shapes/ScheduleInterval'

interface IProps {
  interval: ScheduleInterval
  onRmGroupPress: (id: number) => void
}

const ScheduleHourTable: FC<IProps> = ({ interval, onRmGroupPress }) => {

  const classroom = interval.classroom

  const rows = interval.classroom
    ? interval.groups.map(group => (
      <tr key={ group.id }>
        <td className='text-center align-middle'>{ group.name } ({ classroom?.name })</td>
        <td className='text-center'>
          <button className='btn btn-link' onClick={ () => onRmGroupPress(group.scheduleRowId) }>Quitar</button>
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