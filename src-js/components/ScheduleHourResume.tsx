import React from 'react'
import HourAdditionForm from './Forms/HourAdditionForm'
import ScheduleHourTable from './Tables/ScheduleHourTable'

const ScheduleHourResume = () => {
  return (
    <section className='mt-4'>
      <h3>Editando la <span></span>º hora (<span></span>) del <span></span></h3>
      <ScheduleHourTable />
      <HourAdditionForm />
    </section>
  )
}

export default ScheduleHourResume