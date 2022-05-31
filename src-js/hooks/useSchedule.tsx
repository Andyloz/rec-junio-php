import React, { useState } from 'react'
import Schedule from '../components/shapes/Schedule'
import { buildParametrizedUrl, useFetchWith } from './useFetch'
import User from '../components/shapes/User'

export interface GetSchedule {
  Request: { userId: number }
  Response: { schedule: Schedule }
}

const useSchedule = () => {
  const [schedule, setSchedule] = useState<Schedule>()
  const [user, setUser] = useState<User>()

  const { doRequest } = useFetchWith.urlPlaceholders<GetSchedule['Request'], GetSchedule['Response']>(
    buildParametrizedUrl`api/obtain-schedule/${ 'userId' }`,
  )

  const refreshData = () => {
    if (!user) {
      console.log('No params to refresh data')
    } else {
      doRequest({ userId: user.id_usuario }).then(({ schedule }) => setSchedule(schedule))
    }
  }

  return { schedule, user, setUser, refreshData }
}

export default useSchedule
