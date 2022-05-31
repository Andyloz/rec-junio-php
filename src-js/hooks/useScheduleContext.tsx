import React, { createContext, FC, ReactNode, useState } from 'react'
import Schedule from '../components/shapes/Schedule'
import { buildParametrizedUrl, useFetchWith } from './useFetch'

export interface GetSchedule {
  Request: { userId: number }
  Response: { schedule: Schedule }
}

const ScheduleContext = createContext<ReturnType<typeof useSchedule> | undefined>(undefined)

export const ScheduleProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const context = useSchedule()
  return <ScheduleContext.Provider value={ context } children={ children } />
}

export const useSchedule = () => {
  const [schedule, setSchedule] = useState<Schedule>()
  const [params, setParams] = useState<GetSchedule['Request']>()

  const { doRequest } = useFetchWith.urlPlaceholders<GetSchedule['Request'], GetSchedule['Response']>(
    buildParametrizedUrl`api/obtain-schedule/${ 'userId' }`,
  )

  const refreshData = () => {
    if (!params) {
      console.log('No params to refresh data')
    } else {
      doRequest(params).then(({ schedule }) => setSchedule(schedule))
    }
  }

  return { schedule, params, setParams, refreshData }
}

export const useScheduleContext = () => {
  const context = useSchedule()
  if (!context) {
    throw new Error('Schedule context not initialized')
  }
  return context
}