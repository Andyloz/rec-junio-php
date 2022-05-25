import ScheduleInterval from './ScheduleInterval'

export type Day = 1 | 2 | 3 | 4 | 5
export type Hour = 1 | 2 | 3 | 4 | 5 | 6 | 7

interface Schedule  {
  [key: string]: {
    [key: string]: ScheduleInterval
  }
}

export default Schedule
