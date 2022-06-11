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
  coGroups: Exclude<ReturnType<typeof useGroupsOp>['coGroups'], undefined>
  removeOccupiedClassrooms: ReturnType<typeof useGroupsOp>['removeCoGroups']
  repeatLastAddGroup: ReturnType<typeof useGroupsOp>['repeatLastAddGroup']
}

const OccupiedClassroomModal: FC<OccupiedClassroomModalProps> = (
  {
    freeClassrooms,
    selectedInterval,
    coGroups,
    removeOccupiedClassrooms,
    repeatLastAddGroup,
  },
) => {
  const [continueOp, setContinueOp] = useState(false)
  const { doRequest: changeClassroom } =
    useFetchWith.bodyParams<{ 'id-schedules': number[], 'id-classroom': number }>('api/edit-classroom-in-hour', {
      method: 'PUT',
    })

  const { day, hour } = selectedInterval
  const fDay = fDays[day].toLowerCase()
  const fHour = `${ fHours[hour] }`
  const title = `Cambio de aula del ${ fDay } a ${ fHour }`

  const users = new Set<number>()
  const groups = new Set<string>()
  coGroups.forEach(g => users.add(g.usuario))
  coGroups.forEach(g => groups.add(g.nombre))

  const fUsers = `${ 
    users.size === 1 ? 'el profesor' : 'los profesores'
  } ${ 
    Array.from(users).map(u => `${ u }`).join(', ').replace(/,(?=[^,]*$)/, ' y')
  }`

  const fGroups = `${ 
    groups.size === 1 ? 'el grupo' : 'los grupos' 
  } ${ 
    Array.from(groups).join(', ').replace(/,(?=[^,]*$)/, ' y') 
  }`

  if (!continueOp) {

    const body = (
      <div className='text-center'>
        <p>Has seleccionado un aula que está siendo utilizada por { fUsers } con { fGroups }. Debes
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
          const select = e.currentTarget.querySelector('select')!
          changeClassroom({
            'id-schedules': coGroups.map(g => g.id_horario),
            'id-classroom': parseInt(select.value),
          })
            .then(repeatLastAddGroup)
            .then(removeOccupiedClassrooms)
        } }>
        <p>Selecciona una nueva clase para { groups }: </p>
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
