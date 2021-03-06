import React, { FC, FormEventHandler, useEffect, useState } from 'react'
import User from '../shapes/User'
import { useFetch } from '../../hooks/useFetch'

interface IProps {
  onSelectedUser: (teacher: User) => void
}

type Teachers = { [userId: number]: User }

const UserSelectorForm: FC<IProps> = ({ onSelectedUser }) => {
  const [teachers, setTeachers] = useState<Teachers>()

  // todo: handle message arrive
  const { doRequest: doTeachersRequest } = useFetch<{ teachers: User[] }>('api/obtain-teachers')

  useEffect(() => {
    doTeachersRequest().then((res) => {
      if (!res.teachers) {
        return
      }
      setTeachers(
        res.teachers.reduce((list, user) => {
          list[user.id_usuario] = user
          return list
        }, {} as Teachers),
      )
    })
  }, [])

  const teachersSelect = !teachers ? undefined : (
    <select id='teacher-selector' name='teacher-selector' className='form-select mb-3 me-4 mb-sm-0'
            style={ { maxWidth: 'max-content' } }>
      {
        teachers && Object.entries(teachers).map(([id, teacher]) => (
          <option key={ id } value={ id }>{ teacher.nombre }</option>
        ))
      }
    </select>
  )

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (!teachers) {
      return
    }
    const userId = Number(e.currentTarget.querySelector('select')?.value)
    if (!isNaN(userId)) {
      onSelectedUser(teachers[userId])
    }
  }

  return (
    <form className='d-flex flex-wrap align-items-center mt-4' onSubmit={ handleSubmit }>
      <label htmlFor='teacher-selector' className='form-label m-0 mb-2 me-4 mb-sm-0'>
        Seleccione el profesor { !teachers && <em>(cargando la lista de profesores)</em> }
      </label>
      { teachersSelect }
      <button type='submit' className='btn btn-primary mb-3 mb-sm-0'>Ver Horario</button>
    </form>
  )
}

export default UserSelectorForm
