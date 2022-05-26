import React, { FC } from 'react'
import ScheduleInterval from '../shapes/ScheduleInterval'

interface IProps {
  interval: ScheduleInterval
}

const ScheduleHourTable: FC<IProps> = ({ interval }) => {
  console.log(interval)

  const rows = []
  if (interval) {
    interval.groups.forEach(group => {
      rows.push(
        <tr>
          <td>{ group.name }</td>
          <td>
            <button className='btn btn-link'>Quitar</button>
          </td>
        </tr>,
      )
    })
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