import React from 'react'
import Button from '../Button'
import Label from './FormField/Label'
import Select from './FormField/Select'

const TeacherSelectorForm = () => {
  return (
    <form className='d-flex flex-row flex-wrap align-items-center mt-4' method='get'>
      <Label idFor='teacher-selector' className='m-0 mb-2 me-4 mb-sm-0'>Seleccione el profesor</Label>
      <Select name='teacher-selector' className='mb-3 w-25 me-4 mb-sm-0'>
        <option value='1' selected>Apellido1 Apellido2 NOMBRE1</option>
        <option value='2'>Apellido1 Apellido2 NOMBRE2</option>
        <option value='3'>Apellido1 Apellido2 NOMBRE3</option>
      </Select>
      <Button type='submit' level='btn-primary'>Ver Horario</Button>
    </form>
  )
}

export default TeacherSelectorForm