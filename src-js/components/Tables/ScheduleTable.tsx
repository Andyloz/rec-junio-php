import React, { FC, ReactNode, useEffect, useMemo } from 'react'
import useApi from '../../hooks/useApi'
import Schedule from '../shapes/Schedule'
import User from '../shapes/User'
import UserType from '../shapes/UserType'

interface IProps {
  user: User
}

const Cell: FC<{ children?: ReactNode }> = ({children}) => (
  <td>
    <div className='h-100 d-flex flex-column g-1 justify-content-center align-items-center'>
      {children}
    </div>
  </td>
)

const ScheduleTable: FC<IProps> = ({ user }) => {
  const { response, doRequest } = useApi<{ schedule: Schedule }>()

  useEffect(() => {
    doRequest(`api/obtain-schedule/${ user.id_usuario }`)
  }, [user])

  const builtRows = useMemo(() => {

    if (!response) {
      return undefined
    }

    const rowHeaders = [
      <></>,
      <th key={`th${1}`} className='text-center' scope='row'>8:15 - 9:15</th>,
      <th key={`th${2}`} className='text-center' scope='row'>9:15 - 10:15</th>,
      <th key={`th${3}`} className='text-center' scope='row'>10:15 - 11:15</th>,
      <tr key={`th${4}`}>
        <th className='text-center' scope='row'>11:15 - 11:45</th>
        <td colSpan={ 5 } className='text-center align-middle'>RECREO</td>
      </tr>,
      <th key={`th${5}`} className='text-center' scope='row'>11:45 - 12:45</th>,
      <th key={`th${6}`} className='text-center' scope='row'>12:45 - 13:45</th>,
      <th key={`th${7}`} className='text-center' scope='row'>13:45 - 14:45</th>,
    ]

    const rows = []

    for (let hour = 1; hour <= 7; hour++) {
      if (hour === 4) {
        rows.push(rowHeaders[hour])
        continue
      }

      const row = []
      for (let day = 0; day <= 5; day++) {

        if (day === 0) {
          row.push(rowHeaders[hour])
          continue
        }

        const interval = response.schedule[`d${ day }`][`h${ hour }`]
        if (!('day' in interval)) {
          row.push(
            <Cell key={`d${day}-h${hour}`} />
          )
          continue
        }

        const groups = interval.groups
          .map(g => g.name)
          .join('/')
        const classrooms = interval.classrooms
          .map(c => c.name)
          .join('/')

        row.push(
          <Cell key={`d${day}-h${hour}`}>
            <span>{ groups }</span>
            <span>({ classrooms })</span>
            { user.tipo === UserType.Admin &&
              <button className='link-primary'>Editar</button> }
          </Cell>,
        )
      }
      rows.push(<tr key={ `h${hour}` }>{ row }</tr>)
    }

    return rows
  }, [response])

  return (
    <div className='table-responsive'>
      <table className='table table-bordered mt-4'>
        <thead className='table-primary'>
        <tr className='text-center'>
          <th scope='col'></th>
          <th scope='col'>Lunes</th>
          <th scope='col'>Martes</th>
          <th scope='col'>Miércoles</th>
          <th scope='col'>Jueves</th>
          <th scope='col'>Viernes</th>
        </tr>
        </thead>
        <tbody>
        { response && builtRows
          || (
            <>
              <tr>
                <th className='text-center' scope='row'>8:15 - 9:15</th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th className='text-center' scope='row'>9:15 - 10:15</th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th className='text-center' scope='row'>10:15 - 11:15</th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th className='text-center' scope='row'>11:15 - 11:45</th>
                <td colSpan={ 5 } className='text-center align-middle'>RECREO</td>
              </tr>
              <tr>
                <th className='text-center' scope='row'>11:45 - 12:45</th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th className='text-center' scope='row'>12:45 - 13:45</th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th className='text-center' scope='row'>13:45 - 14:45</th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </>
          ) }
        </tbody>
      </table>
    </div>
  )
}

export default ScheduleTable