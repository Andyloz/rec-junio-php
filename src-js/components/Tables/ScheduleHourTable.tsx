import React, { FC } from 'react'
import ScheduleInterval from '../shapes/ScheduleInterval'

interface IProps {
  interval: ScheduleInterval
  onRmGroupPress: (id: number) => void
}

const ScheduleHourTable: FC<IProps> = ({ interval, onRmGroupPress }) => {

  if (interval) {
    const classroom = interval.classroom
    interval.groups.map(group => (
      <tr key={ group.id }>
        <td>{ group.name } ({ classroom?.name })</td>
        <td className='align-middle'>
          <button className='btn btn-link' onClick={ () => onRmGroupPress(group.id) }>Quitar</button>
        </td>
      </tr>
    ))
  } else {
    rows.push(<tr></tr>)
  }

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