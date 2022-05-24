import React, { FC, useEffect } from 'react'
import useApi from '../../hooks/useApi'

interface IProps {
  userId: number
}

const ScheduleTable: FC<IProps> = ({ userId }) => {
  const { response, doRequest } = useApi()

  useEffect(() => {
    if (response) {
      console.log(response)
    }
  }, [response])

  useEffect(() => {
    doRequest(`api/obtain-schedule/${ userId }`)
  }, [userId])

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
        </tbody>
      </table>
    </div>
  )
}

export default ScheduleTable