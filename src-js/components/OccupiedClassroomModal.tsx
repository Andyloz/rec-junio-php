import React, { FC, useState } from 'react'
import useGroupsOp from '../hooks/useGroupsOp'
import Modal from './Modal'
import { SelectedInterval } from './Dashboard'
import { fDays, fHours } from '../formattedIntervals'
import Classroom from './shapes/Classroom'
import { useFetchWith } from '../hooks/useFetch'

export interface OccupiedClassroomModalProps {
  freeClassrooms: Classroom[]
  selectedInterval: SelectedInterval
  occupiedClassrooms: Exclude<ReturnType<typeof useGroupsOp>['occupiedClassrooms'], undefined>
  removeOccupiedClassrooms: ReturnType<typeof useGroupsOp>['removeOccupiedClassrooms']
  repeatLastAddGroup: ReturnType<typeof useGroupsOp>['repeatLastAddGroup']
}

const OccupiedClassroomModal: FC<OccupiedClassroomModalProps> = (
  {
    freeClassrooms,
    selectedInterval,
    occupiedClassrooms,
    removeOccupiedClassrooms,
    repeatLastAddGroup,
  },
) => {
  const [continueOp, setContinueOp] = useState(false)
  const { doRequest: changeClassroom } =
    useFetchWith.bodyParams<{ 'id-schedule': number, 'id-classroom': number }>('api/edit-classroom-in-hour', {
      method: 'PUT',
    })

  const { day, hour } = selectedInterval
  const fDay = fDays[day].toLowerCase()
  const fHour = `${ fHours[hour] }`
  const title = `Cambio de aula del ${ fDay } a ${ fHour }`
  const user = occupiedClassrooms[0]['usuario']
  const group = occupiedClassrooms[0]['nombre']

  if (!continueOp) {

    const body = (
      <div className='text-center'>
        <p>Has seleccionado un aula que está siendo utilizada por el profesor { user } con el grupo { group }. Debes
          cambiarles la clase antes de continuar.</p>
        <p><strong>¿Deseas continuar?</strong></p>
      </div>
    )

    const buttons = (
      <>
        <button type='button' className='btn btn-secondary' onClick={ removeOccupiedClassrooms }>Cerrar</button>
        <button
          key='continue' type='button' className='btn btn-primary'
          onClick={ () => setContinueOp(true) }
          children='Continuar'
        />
      </>
    )

    return <Modal title={ title } body={ body } buttons={ buttons } />

  } else {
    const body = (
      <form
        id='edit-classroom-form'
        className='text-center'
        onSubmit={ e => {
          e.preventDefault()
          const select = e.currentTarget.querySelector('select') as HTMLSelectElement
          const promises = occupiedClassrooms.map(oc => changeClassroom({
            'id-schedule': oc['id_horario'],
            'id-classroom': parseInt(select.value),
          }))
          Promise.all(promises)
            .then(repeatLastAddGroup)
            .then(removeOccupiedClassrooms)
        } }>
        <p>Selecciona una nueva clase para el grupo { group }: </p>
        <select>{
          freeClassrooms.map(({ id, name }) => (
            <option key={ id } value={ id }>{ name }</option>
          ))
        }</select>
      </form>
    )

    const buttons = (
      <>
        <button type='button' className='btn btn-secondary' onClick={ removeOccupiedClassrooms }>Cerrar</button>
        <button key='submit' type='submit' form='edit-classroom-form' className='btn btn-primary'>Cambiar clase</button>
      </>
    )

    return <Modal title={ title } body={ body } buttons={ buttons } />

  }
}

export default OccupiedClassroomModal
