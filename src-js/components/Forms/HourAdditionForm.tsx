import React, { FC, useEffect } from 'react'
import ScheduleInterval from '../shapes/ScheduleInterval'
import useApi from '../../hooks/useApi'
import Group from '../shapes/Group'
import Classroom from '../shapes/Classroom'
import User from '../shapes/User'

interface IProps {
  user: User
  interval: ScheduleInterval
}

type OccpClassroomsResponse = { 'occupied-classrooms': Classroom[] } | { msg: string }
type FreeClassroomsResponse = { 'free-classrooms': Classroom[] } | { msg: string }

type NormalGroupsResponse = { 'groups-with-classroom': Group[] } | { msg: string }
type OnGuardGroupsResponse = { 'groups-without-classroom': Group[] } | { msg: string }

const HourAdditionForm: FC<IProps> = ({ user, interval }) => {
  const { day, hour, groups, classroom } = interval
  const emptyInterval = groups.length === 0 && !classroom
  const guardInterval = groups.some(g => g.name.startsWith('G') || g.name === 'FDIR')

  const occpClassApi = useApi<OccpClassroomsResponse>()
  const freeClassApi = useApi<FreeClassroomsResponse>()

  const normalGroupsApi = useApi<NormalGroupsResponse>()
  const onGuardGroupsApi = useApi<OnGuardGroupsResponse>()

  useEffect(() => {
    occpClassApi.doRequest(`api/obtain-free-classrooms/${ day }/${ hour }`)
  }, [])

  useEffect(() => {
    freeClassApi.doRequest(`api/obtain-free-classrooms/${ day }/${ hour }`)
  }, [])

  useEffect(() => {
    normalGroupsApi.doRequest(`api/obtain-groups-with-classroom`)
  }, [])

  useEffect(() => {
    onGuardGroupsApi.doRequest(`api/obtain-groups-without-classroom`)
  }, [])

  useEffect(() => {
    console.log(occpClassApi.response)
  }, [occpClassApi, freeClassApi])

  const selectGroups = {
    'Con aula': normalGroupsApi.response && 'groups-with-classroom' in normalGroupsApi.response
      ? normalGroupsApi.response['groups-with-classroom']
      : undefined,
    'Sin aula': emptyInterval && onGuardGroupsApi.response && 'groups-without-classroom' in onGuardGroupsApi.response
      ? onGuardGroupsApi.response['groups-without-classroom']
      : undefined,
  }

  const selectClassrooms = {
    'Aulas ocupadas': occpClassApi.response && 'occupied-classrooms' in occpClassApi.response
      ? occpClassApi.response['occupied-classrooms']
      : undefined,
    'Aulas libres': freeClassApi.response && 'free-classrooms' in freeClassApi.response
      ? freeClassApi.response['free-classrooms']
      : undefined,
  }
  console.log('interval', interval, '\n',
    'user', user.id_usuario, '\n',
    'occpClassApi', occpClassApi, '\n',
    'freeClassApi', freeClassApi, '\n',
  )

  return (
    <form method='post' className='d-flex flex-row align-items-center'>
      <label htmlFor='hour-addition-group' className='form-label m-0 mb-2 me-4 mb-sm-0'>Grupo</label>
      <select id='hour-addition-group' name='hour-addition-group' className='form-select mb-3 w-25 me-4 mb-sm-0'
              style={ { maxWidth: 'max-content' } }>
        {
          Object.entries(selectGroups).map(([title, groups]) => (
            !groups ? undefined : (
              <optgroup key={ title } label={ title }>
                { groups.map(g => <option key={ g.id } value={ g.id } children={ g.name } />) }
              </optgroup>
            )
          ))
        }
      </select>

      <label htmlFor='hour-addition-classroom' className='form-label m-0 mb-2 me-4 mb-sm-0'>Aula</label>
      <select id='hour-addition-classroom' name='hour-addition-classroom' className='form-select mb-3 w-25 me-4 mb-sm-0'
              style={ { maxWidth: 'max-content' } } disabled={ !emptyInterval }>
        {
          Object.entries(selectClassrooms).map(([title, classrooms]) => (
            !classrooms ? undefined : (
              <optgroup key={ title } label={ title }>
                { classrooms.map(c => <option key={ c.id } value={ c.id } children={ c.name } />) }
              </optgroup>
            )
          ))
        }
      </select>

      <button
        type='submit' className='btn btn-primary'
        disabled={ guardInterval }
        children='Añadir'
      />
    </form>
  )
}

export default HourAdditionForm