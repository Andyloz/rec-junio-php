import ScheduleGroup from './ScheduleGroup'
import ScheduleClassroom from './ScheduleClassroom'

interface ScheduleInterval {
  ids: number[]
  day: number
  hour: number
  classroom: ScheduleClassroom
  groups: ScheduleGroup[]
}

export default ScheduleInterval
