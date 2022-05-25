import ScheduleGroup from './ScheduleGroup'
import ScheduleClassroom from './ScheduleClassroom'

interface ScheduleInterval {
  day: number
  hour: number
  groups: Record<ScheduleGroup['id'], ScheduleGroup>
  classrooms: Record<ScheduleClassroom['id'], ScheduleClassroom>
}

export default ScheduleInterval
