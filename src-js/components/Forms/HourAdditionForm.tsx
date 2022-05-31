import React, { FC, FormEventHandler, useEffect, useRef, useState } from 'react'
import { buildParametrizedUrl, useFetch, useFetchWith } from '../../hooks/useFetch'
import Group from '../shapes/Group'
import Classroom from '../shapes/Classroom'
import { AddGroupDetails, IntervalData } from '../Dashboard'

export interface HourAdditionFormProps {
  intervalData: IntervalData
  onAddPressed: (details: AddGroupDetails) => void
}

// todo: message xddd

type OccpClassroomsResponse = { 'occupied-classrooms': Classroom[] }
type FreeClassroomsResponse = { 'free-classrooms': Classroom[] }

type NormalGroupsResponse = { 'groups-with-classroom': Group[] }
type OnGuardGroupsResponse = { 'groups-without-classroom': Group[] }

const HourAdditionForm: FC<HourAdditionFormProps> = ({ intervalData, onAddPressed }) => {
  const { day, hour, user, interval } = intervalData

  const [occpClassrooms, setOccpClassrooms] = useState<Classroom[]>()
  const [freeClassrooms, setFreeClassrooms] = useState<Classroom[]>()

  const [normalGroups, setNormalGroups] = useState<Group[]>()
  const [onGuardGroups, setOnGuardGroups] = useState<Group[]>()

  const { doRequest: doOccpClassRequest } =
    useFetchWith.urlPlaceholders<{ day: number, hour: number }, OccpClassroomsResponse>(
      buildParametrizedUrl`api/obtain-occupied-classrooms/${ 'day' }/${ 'hour' }`,
    )
  const { doRequest: doFreeClassRequest } =
    useFetchWith.urlPlaceholders<{ day: number, hour: number }, FreeClassroomsResponse>(
      buildParametrizedUrl`api/obtain-free-classrooms/${ 'day' }/${ 'hour' }`,
    )

  const { doRequest: doNormalGroupsRequest } = useFetch<NormalGroupsResponse>('api/obtain-groups-with-classroom')
  const { doRequest: doGuardGroupsRequest } = useFetch<OnGuardGroupsResponse>('api/obtain-groups-without-classroom')

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

  const selectGroups = { 'Con aula': normalGroups, 'Sin aula': onGuardGroups }
  const selectClassrooms = { 'Aulas ocupadas': occpClassrooms, 'Aulas libres': freeClassrooms }

  const groupsSelectRef = useRef<HTMLSelectElement>(null)
  const classroomSelectRef = useRef<HTMLSelectElement>(null)

  const emptyInterval = !interval
  const guardInterval = !!interval && interval.groups.some(g => g.name.startsWith('G') || g.name === 'FDIR')

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

  const groupsSelect = (
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
  )

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

  const classroomsSelect = (
    <select ref={ classroomSelectRef } id='id-classroom' name='id-classroom'
            className='form-select mb-3 w-25 me-4 mb-sm-0'
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
  )

  const button = (
    <button
      type='submit' className='btn btn-primary'
      disabled={ guardInterval }
      children='Añadir'
    />
  )

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    onAddPressed({
      day, hour, 'id-user': user.id_usuario,
      'id-group': parseInt(groupsSelectRef.current?.value as string),
      'id-classroom': parseInt(classroomSelectRef.current?.value as string),
    })
  }

  return (
    <form method='post' className='d-flex flex-row align-items-center' onSubmit={ onSubmitHandler }>
      <label htmlFor='id-group' className='form-label m-0 mb-2 me-4 mb-sm-0'>Grupo</label>
      { groupsSelect }
      <label htmlFor='id-classroom' className='form-label m-0 mb-2 me-4 mb-sm-0'>Aula</label>
      { classroomsSelect }
      { button }
    </form>
  )
}

export default HourAdditionForm