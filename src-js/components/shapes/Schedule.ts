import ScheduleInterval from './ScheduleInterval'

interface Schedule  {
  [k: number]: {
    [k: number]: ScheduleInterval | {}
  }
}

export default Schedule
