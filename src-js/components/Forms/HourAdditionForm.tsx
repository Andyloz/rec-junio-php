import React, { ChangeEventHandler, FC, FormEventHandler, useEffect, useRef } from 'react'
import useGroupsOp from '../../hooks/useGroupsOp'
import ScheduleInterval from '../shapes/ScheduleInterval'
import User from '../shapes/User'
import useClassroomsGroups from '../../hooks/useClassesGroups'

export interface HourAdditionFormProps {
  day: number
  hour: number
  user: User
  interval: ScheduleInterval | {}
  groups: Exclude<ReturnType<typeof useClassroomsGroups>['groups'], undefined>
  classrooms: Exclude<ReturnType<typeof useClassroomsGroups>['classrooms'], undefined>
  onAddPressed: ReturnType<typeof useGroupsOp>['addGroup']
}

const GUARD_GROUP_ID = 51
const UNASSIGNED_CLASSROOM_ID = 64

// todo: message

const HourAdditionForm: FC<HourAdditionFormProps> = (
  {
    day, hour,
    user, interval,
    groups, classrooms,
    onAddPressed,
  },
) => {
  const groupsSelectRef = useRef<HTMLSelectElement>(null)
  const classroomSelectRef = useRef<HTMLSelectElement>(null)

  const emptyInterval = !('day' in interval)
  const guardInterval = !emptyInterval && interval.groups.some(g => g.name.startsWith('G') || g.name === 'FDIR')

  useEffect(() => {
    const groupsSelect = groupsSelectRef.current
    if (!groupsSelect) {
      return
    }
    if (emptyInterval) {
      groupsSelect.value = GUARD_GROUP_ID + ''
    } else {
      const firstOption = groupsSelectRef.current.querySelector('option')
      if (firstOption) {
        groupsSelect.value = firstOption.value
      }
    }
  }, [])

  const groupsSelectOnChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const onGuardGroup = groups['Sin aula'].some(g => g.id === Number(e.target.value))
    if (onGuardGroup && classroomSelectRef.current) {
      classroomSelectRef.current.value = UNASSIGNED_CLASSROOM_ID + ''
    }
  }

  const groupsSelect = (
    <select
      ref={ groupsSelectRef } id='id-group' name='id-group' className='form-select mb-3 w-25 me-4 mb-sm-0'
      style={ { maxWidth: 'max-content' } } disabled={ guardInterval } defaultValue={ 52 }
      onChange={ groupsSelectOnChange }
    >
      {
        Object.entries(groups).map(([title, groups]) => (
          guardInterval ? undefined : (
            <optgroup key={ title } label={ title }>
              { groups.map(g => <option key={ g.id } value={ g.id } children={ g.name } />) }
            </optgroup>
          )
        ))
      }
    </select>
  )

  useEffect(() => {
    const classroomsSelect = classroomSelectRef.current
    if (!classroomsSelect) {
      return
    }
    if (emptyInterval) {
      classroomsSelect.value = UNASSIGNED_CLASSROOM_ID + ''
    } else {
      classroomsSelect.value = interval.classroom?.id + ''
    }
  }, [])

  const classroomsSelect = (
    <select ref={ classroomSelectRef } id='id-classroom' name='id-classroom'
            className='form-select mb-3 w-25 me-4 mb-sm-0'
            style={ { maxWidth: 'max-content' } } disabled={ !emptyInterval }>
      {
        Object.entries(classrooms).map(([title, classrooms]) => (
          guardInterval ? undefined : (
            <optgroup key={ title } label={ title }>
              { classrooms.map(c => <option key={ c.id } value={ c.id } children={ c.name } />) }
            </optgroup>
          )
        ))
      }
    </select>
  )

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    // noinspection JSIgnoredPromiseFromCall
    onAddPressed({
      day, hour,
      'id-user': user.id_usuario,
      'id-group': parseInt(groupsSelectRef.current?.value as string),
      'id-classroom': parseInt(classroomSelectRef.current?.value as string),
    })
  }

  return (
    <form method='post' className='d-flex flex-row align-items-center' onSubmit={ onSubmitHandler }>
      <label htmlFor='id-group' className='form-label m-0 mb-2 me-4 mb-sm-0'>Grupo</label>
      { groupsSelect }
      <label htmlFor='id-classroom' className='form-label m-0 mb-2 me-4 mb-sm-0'>Aula</label>
      { classroomsSelect }
      <button
        type='submit' className='btn btn-primary'
        disabled={ guardInterval }
        children='Añadir'
      />
    </form>
  )
}

export default HourAdditionForm