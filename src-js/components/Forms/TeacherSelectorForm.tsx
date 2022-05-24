import React, { FC, FormEventHandler, useEffect, useMemo } from 'react'
import Button from '../Button'
import Label from './FormField/Label'
import Select from './FormField/Select'
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
  })

  const teachersList = useMemo(() => {
    if (teachersLoading) return undefined

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
    <form className='d-flex flex-row flex-wrap align-items-center mt-4' onSubmit={ handleSubmit }>
      <Label idFor='teacher-selector' className='m-0 mb-2 me-4 mb-sm-0'>
        Seleccione el profesor
        { teachersLoading && <strong>(cargando la lista de profesores)</strong> }
      </Label>
      <Select name='teacher-selector' className='mb-3 w-25 me-4 mb-sm-0'>
        {
          teachersList && Object.entries(teachersList).map(([id, teacher]) => (
            <option key={ id } value={ id }>{ teacher.nombre }</option>
          ))
        }
      </Select>
      <Button type='submit' level='btn-primary'>Ver Horario</Button>
    </form>
  )
}

export default TeacherSelectorForm
