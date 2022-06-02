import { buildParametrizedUrl, useFetch, useFetchWith } from './useFetch'
import Classroom from '../components/shapes/Classroom'
import Group from '../components/shapes/Group'
import { useState } from 'react'

interface ClassroomsList {
  req: {
    occupied: { 'occupied-classrooms': Classroom[] }
    free: { 'free-classrooms': Classroom[] }
    params: { day: number, hour: number }
  }
  state: Record<'Libres' | 'Ocupadas', Classroom[]>
}

interface GroupsList {
  req: {
    normal: { 'groups-with-classroom': Group[] }
    guard: { 'groups-without-classroom': Group[] }
  }
  state: Record<'Con aula' | 'Sin aula', Group[]>
}

const useClassroomsGroups = () => {
  const groupsReq = {
    normal: useFetch<GroupsList['req']['normal']>('api/obtain-groups-with-classroom').doRequest,
    guard: useFetch<GroupsList['req']['guard']>('api/obtain-groups-without-classroom').doRequest,
  }

  const classroomsReq = {
    free: useFetchWith.urlPlaceholders<ClassroomsList['req']['params'], ClassroomsList['req']['free']>(
      buildParametrizedUrl`api/obtain-free-classrooms/${ 'day' }/${ 'hour' }`,
    ).doRequest,
    occupied: useFetchWith.urlPlaceholders<ClassroomsList['req']['params'], ClassroomsList['req']['occupied']>(
      buildParametrizedUrl`api/obtain-occupied-classrooms/${ 'day' }/${ 'hour' }`,
    ).doRequest,
  }

  const [classrooms, setClassrooms] = useState<ClassroomsList['state']>()
  const [groups, setGroups] = useState<GroupsList['state']>()
  const [params, setParams] = useState<ClassroomsList['req']['params']>()

  const refreshData = () => {
    if (!params) {
      console.log('No params to refresh data')
      return Promise.resolve()
    }

    return Promise.all([
      // Groups
      Promise.all([
        groupsReq.normal(),
        groupsReq.guard(),
      ]).then(([normal, guard]) => {
        setGroups({
          'Con aula': normal['groups-with-classroom'],
          'Sin aula': guard['groups-without-classroom'],
        })
      }),

      // Classrooms
      Promise.all([
        classroomsReq.free(params),
        classroomsReq.occupied(params),
      ]).then(([free, occupied]) => {
        setClassrooms({
          'Libres': free['free-classrooms'],
          'Ocupadas': occupied['occupied-classrooms'],
        })
      })
    ])
  }

  return { classrooms, groups, params, setParams, refreshData }
}

export default useClassroomsGroups
