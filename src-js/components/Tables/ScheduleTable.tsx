import React, { FC, ReactNode, useEffect, useMemo } from 'react'
import useApi from '../../hooks/useApi'
import Schedule from '../shapes/Schedule'
import User from '../shapes/User'
import UserType from '../shapes/UserType'
import ScheduleInterval from '../shapes/ScheduleInterval'
import ScheduleClassroom from '../shapes/ScheduleClassroom'

interface IProps {
  user: User
  type: UserType
  onEditPress?(interval: ScheduleInterval): void
}

const Cell: FC<{ children?: ReactNode }> = ({ children }) => (
  <td className='align-middle'>
    <div className='text-center d-flex flex-column gap-1 justify-content-center align-items-center'>
      { children }
    </div>
  </td>
)

const ScheduleTable: FC<IProps> = ({ user, type, onEditPress }) => {
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
      <th key={ `th${ 1 }` } className='text-center align-middle' scope='row'>8:15 - 9:15</th>,
      <th key={ `th${ 2 }` } className='text-center align-middle' scope='row'>9:15 - 10:15</th>,
      <th key={ `th${ 3 }` } className='text-center align-middle' scope='row'>10:15 - 11:15</th>,
      <tr key={ `th${ 4 }` }>
        <th className='text-center align-middle' scope='row'>11:15 - 11:45</th>
        <td colSpan={ 5 } className='text-center align-middle'>RECREO</td>
      </tr>,
      <th key={ `th${ 5 }` } className='text-center align-middle' scope='row'>11:45 - 12:45</th>,
      <th key={ `th${ 6 }` } className='text-center align-middle' scope='row'>12:45 - 13:45</th>,
      <th key={ `th${ 7 }` } className='text-center align-middle' scope='row'>13:45 - 14:45</th>,
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
        const col = []

        if ('day' in interval) {
          const groups = interval.groups
            .map(g => g.name)
            .join(' / ')
          const classroom = interval.classroom as ScheduleClassroom

          col.push(
            <span key='groups' style={ { maxWidth: '200px' } }>{ groups }</span>,
            <span key='classrooms' style={ { maxWidth: '200px' } }>({ classroom.name })</span>,
          )
        }

        row.push(
          <Cell key={ `d${ day }-h${ hour }` }>
            { col }
            { type === UserType.Admin &&
              <a
                role='button'
                className='link-primary'
                onClick={() => onEditPress && onEditPress(
                  'day' in interval
                    ? interval
                    : {day: day, hour: hour, classroom: undefined, groups: []}
                )}
                children='Editar'
              /> }
          </Cell>,
        )
      }
      rows.push(<tr key={ `h${ hour }` }>{ row }</tr>)
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