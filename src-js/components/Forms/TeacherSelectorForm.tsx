import React, { FC, FormEventHandler, useEffect, useRef, useState } from 'react'
import User from '../shapes/User'
import useApi, { useApi2 } from '../../hooks/useApi'

interface IProps {
  onPressedSubmit: (user: User) => void
}

const TeacherSelectorForm: FC<IProps> = ({ onPressedSubmit }) => {
  const { response, doRequest } = useApi<{ teachers: User[] }>() // todo: handle message arrive
  const teachersLoading = typeof response === 'undefined'
  const [teachers, setTeachers] = useState<{ [userId: number]: User }>()

  const { doRequest: doTeachersRequest } = useApi2<undefined | { teachers: User[] }>('api/obtain-teachers')

  useEffect(() => {
    doTeachersRequest().then((res) => {
      if (!res || !res.teachers) {
        return
      }
      setTeachers(
        res.teachers.reduce((list, user) => {
          list[user.id_usuario] = user
          return list
        }, {} as { [userId: number]: User }),
      )
    })
  }, [])

  const teacherRef = useRef<HTMLSelectElement>(null)

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (teachers) {
      onPressedSubmit({
        'teacher-selector': teacherRef.current?.value as string
      })
    }
  }

  return (
    <form className='d-flex flex-wrap align-items-center mt-4' onSubmit={ handleSubmit }>
      <label htmlFor='teacher-selector' className='form-label m-0 mb-2 me-4 mb-sm-0'>
        Seleccione el profesor
        { teachersLoading && <strong>(cargando la lista de profesores)</strong> }
      </label>
      <select ref={teacherRef} id='teacher-selector' name='teacher-selector' className='form-select mb-3 me-4 mb-sm-0'
              style={ { maxWidth: 'max-content' } }>
        {
          teachers && Object.entries(teachers).map(([id, teacher]) => (
            <option key={ id } value={ id }>{ teacher.nombre }</option>
          ))
        }
      </select>
      <button type='submit' className='btn btn-primary mb-3 mb-sm-0'>Ver Horario</button>
    </form>
  )
}

export default TeacherSelectorForm
