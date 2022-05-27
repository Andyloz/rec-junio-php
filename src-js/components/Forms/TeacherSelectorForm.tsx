import React, { FC, FormEventHandler, useEffect, useMemo } from 'react'
import User from '../shapes/User'
import useApi from '../../hooks/useApi'

interface IProps {
  onPressedSubmit: (user: User) => void
}

const TeacherSelectorForm: FC<IProps> = ({ onPressedSubmit }) => {
  const { response, doRequest } = useApi<{ teachers: User[] }>() // todo: handle message arrive
  const teachersLoading = typeof response === 'undefined'

  useEffect(() => {
    doRequest('api/obtain-teachers')
  }, [])

  const teachersList = useMemo(() => {
    if (teachersLoading || !response.teachers) return undefined

    return response.teachers.reduce((list, t) => {
      list[t.id_usuario] = t
      return list
    }, {} as { [userId: number]: User })
  }, [response])

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (teachersList) {
      const formData = new FormData(e.currentTarget)
      const userId = parseInt(formData.get('teacher-selector') as string)
      onPressedSubmit(teachersList[userId])
    }
  }

  return (
    <form className='d-flex flex-wrap align-items-center mt-4' onSubmit={ handleSubmit }>
      <label htmlFor='teacher-selector' className='form-label m-0 mb-2 me-4 mb-sm-0'>
        Seleccione el profesor
        { teachersLoading && <strong>(cargando la lista de profesores)</strong> }
      </label>
      <select id='teacher-selector' name='teacher-selector' className='form-select mb-3 me-4 mb-sm-0'
              style={ { maxWidth: 'max-content' } }>
        {
          teachersList && Object.entries(teachersList).map(([id, teacher]) => (
            <option key={ id } value={ id }>{ teacher.nombre }</option>
          ))
        }
      </select>
      <button type='submit' className='btn btn-primary mb-3 mb-sm-0'>Ver Horario</button>
    </form>
  )
}

export default TeacherSelectorForm
