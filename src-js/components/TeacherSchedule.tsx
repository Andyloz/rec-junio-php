import React from 'react'
import ScheduleTable from './Tables/ScheduleTable'

const TeacherSchedule = () => {
  return (
    <section>
      <h3 className='mt-5'>Horario del profesor <span></span></h3>
      <ScheduleTable />
    </section>
  )
}

export default TeacherSchedule