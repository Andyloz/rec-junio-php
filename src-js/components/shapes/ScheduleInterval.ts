import ScheduleGroup from './ScheduleGroup'
import ScheduleClassroom from './ScheduleClassroom'

interface ScheduleInterval {
  day: number
  hour: number
  groups: ScheduleGroup[]
  classrooms: ScheduleClassroom[]
}

export default ScheduleInterval
