import React, { FC, FormEventHandler, useEffect, useRef, useState } from 'react'
import ScheduleInterval from '../shapes/ScheduleInterval'
import { buildParametrizedUrl, useApi2, useApi2With } from '../../hooks/useApi'
import Group from '../shapes/Group'
import Classroom from '../shapes/Classroom'
import User from '../shapes/User'

interface IProps {
  intervalData: { day: number, hour: number, user: User, interval?: ScheduleInterval }
  onAddPressed: (fd: FormData) => void
}

// todo: message xddd

type OccpClassroomsResponse = { 'occupied-classrooms': Classroom[] }
type FreeClassroomsResponse = { 'free-classrooms': Classroom[] }

type NormalGroupsResponse = { 'groups-with-classroom': Group[] }
type OnGuardGroupsResponse = { 'groups-without-classroom': Group[] }

const HourAdditionForm: FC<IProps> = ({ intervalData, onAddPressed }) => {

  const { day, hour, user, interval } = intervalData
  const emptyInterval = !interval
  const guardInterval = !!interval && interval.groups.some(g => g.name.startsWith('G') || g.name === 'FDIR')

  const [occpClassrooms, setOccpClassrooms] = useState<Classroom[]>()
  const [freeClassrooms, setFreeClassrooms] = useState<Classroom[]>()
  const [normalGroups, setNormalGroups] = useState<Group[]>()
  const [onGuardGroups, setOnGuardGroups] = useState<Group[]>()

  const { doRequest: doOccpClassRequest } = useApi2With.urlPlaceholders<{ day: number, hour: number }, OccpClassroomsResponse>(
    buildParametrizedUrl`api/obtain-occupied-classrooms/${ 'day' }/${ 'hour' }`,
  )

  const { doRequest: doFreeClassRequest } = useApi2With.urlPlaceholders<{ day: number, hour: number }, FreeClassroomsResponse>(
    buildParametrizedUrl`api/obtain-free-classrooms/${ 'day' }/${ 'hour' }`,
  )

  const { doRequest: doNormalGroupsRequest } = useApi2<NormalGroupsResponse>('api/obtain-groups-with-classroom')
  const { doRequest: doGuardGroupsRequest } = useApi2<OnGuardGroupsResponse>('api/obtain-groups-without-classroom')

  useEffect(() => {
    Promise.all([
      doOccpClassRequest({ day: day, hour: hour }),
      doFreeClassRequest({ day: day, hour: hour }),
      doNormalGroupsRequest(),
      doGuardGroupsRequest(),
    ])
      .then(([occpClassroomsResponse, freeClassroomsResponse,
               normalGroupsResponse, onGuardGroupsResponse]) => {
        setOccpClassrooms(occpClassroomsResponse['occupied-classrooms'])
        setFreeClassrooms(freeClassroomsResponse['free-classrooms'])
        setNormalGroups(normalGroupsResponse['groups-with-classroom'])
        setOnGuardGroups(onGuardGroupsResponse['groups-without-classroom'])
      })
  }, [])

  const groupsSelectRef = useRef<HTMLSelectElement>(null)
  const classroomSelectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    if (groupsSelectRef.current?.value) {
      if (emptyInterval) {
        groupsSelectRef.current.value = '51'
        return
      }
      const value = groupsSelectRef.current.querySelector('option')?.value
      if (!value) return
      groupsSelectRef.current.value = value
    }
  }, [onGuardGroups, freeClassrooms, interval])

  useEffect(() => {
    if (classroomSelectRef.current?.value) {
      if (emptyInterval) {
        classroomSelectRef.current.value = '64'
        return
      }
      const value = classroomSelectRef.current.querySelector('option')?.value
      if (!value) return
      classroomSelectRef.current.value = value
    }
  }, [freeClassrooms, interval])

  useEffect(() => {
    if (classroomSelectRef.current?.value && !emptyInterval) {
      classroomSelectRef.current.value = interval.classroom.id + ''
    }
  }, [freeClassrooms, interval])

  const selectGroups = { 'Con aula': normalGroups, 'Sin aula': onGuardGroups }
  const selectClassrooms = { 'Aulas ocupadas': occpClassrooms, 'Aulas libres': freeClassrooms }

  const addPressHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (e.currentTarget.checkValidity()) {
      const formData = new FormData(e.currentTarget)
      formData.append('id-user', user.id_usuario + '')
      formData.append('day', day + '')
      formData.append('hour', hour + '')
      onAddPressed(formData)
    }
  }

  return (
    <form method='post' className='d-flex flex-row align-items-center' onSubmit={ addPressHandler }>
      <label htmlFor='id-group' className='form-label m-0 mb-2 me-4 mb-sm-0'>Grupo</label>
      <select ref={ groupsSelectRef } id='id-group' name='id-group' className='form-select mb-3 w-25 me-4 mb-sm-0'
              style={ { maxWidth: 'max-content' } } disabled={ guardInterval } defaultValue={ 52 }>
        {
          Object.entries(selectGroups).map(([title, groups]) => (
            !groups || guardInterval ? undefined : (
              <optgroup key={ title } label={ title }>
                { groups.map(g => <option key={ g.id } value={ g.id } children={ g.name } />) }
              </optgroup>
            )
          ))
        }
      </select>

      <label htmlFor='id-classroom' className='form-label m-0 mb-2 me-4 mb-sm-0'>Aula</label>
      <select ref={classroomSelectRef} id='id-classroom' name='id-classroom' className='form-select mb-3 w-25 me-4 mb-sm-0'
              style={ { maxWidth: 'max-content' } } disabled={ !emptyInterval }>
        {
          Object.entries(selectClassrooms).map(([title, classrooms]) => (
            !classrooms || guardInterval ? undefined : (
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