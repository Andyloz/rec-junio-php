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
  const { day, hour, groups, classrooms } = interval
  const emptyInterval = groups.length === 0 && classrooms.length === 0
  const guardInterval = groups.some(g => g.name.startsWith('G') || g.name === 'FDIR')

  const occpClassApi = useApi<OccpClassroomsResponse>()
  const freeClassApi = useApi<FreeClassroomsResponse>()
  const normalGroupsApi = useApi<NormalGroupsResponse>()
  const onGuardGroupsApi = useApi<OnGuardGroupsResponse>()

  useEffect(() => {
    occpClassApi.doRequest(`api/obtain-free-classrooms/${ user.id_usuario }/${ day }/${ hour }`)
  }, [])

  useEffect(() => {
    freeClassApi.doRequest(`api/obtain-free-classrooms/${ user.id_usuario }/${ day }/${ hour }`)
  }, [])

  useEffect(() => {
    normalGroupsApi.doRequest(`api/obtain-groups-with-classroom`)
  }, [])

  useEffect(() => {
    onGuardGroupsApi.doRequest(`api/obtain-groups-without-classroom`)
  }, [])

  const normalGroups = normalGroupsApi.response && 'groups-with-classroom' in normalGroupsApi.response
    ? normalGroupsApi.response['groups-with-classroom']
    : undefined

  const onGuardGroups =
    emptyInterval && onGuardGroupsApi.response && 'groups-without-classroom' in onGuardGroupsApi.response
      ? onGuardGroupsApi.response['groups-without-classroom']
      : undefined

  const selectGroups = {
    'Con aula': normalGroups,
    'Sin aula': onGuardGroups,
  }

  return (
    <form method='post' className='d-flex flex-row align-items-center'>
      <label htmlFor='hour-addition-group' className='form-label m-0 mb-2 me-4 mb-sm-0'>Grupo</label>
      <select id='hour-addition-group' name='hour-addition-group' className='form-select mb-3 w-25 me-4 mb-sm-0'
              style={ { maxWidth: 'max-content' } }>
        {
          Object.entries(selectGroups).map(([title, groups]) => (
            !groups ? undefined : (
              <optgroup key={ title } label={ title }>
                {
                  groups.map(g => <option key={ g.id } value={ g.id }>{ g.name }</option>)
                }
              </optgroup>
            )
          ))
        }
      </select>

      <label htmlFor='hour-addition-classroom' className='form-label m-0 mb-2 me-4 mb-sm-0'>Aula</label>
      <select id='hour-addition-classroom' name='hour-addition-classroom' className='form-select mb-3 w-25 me-4 mb-sm-0'
              style={ { maxWidth: 'max-content' } } disabled={ !emptyInterval }>

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