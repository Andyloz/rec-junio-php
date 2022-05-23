import React from 'react'
import Button from '../Button'
import Label from './FormField/Label'
import Select from './FormField/Select'

const HourAdditionForm = () => {

  return (
    <form method='post' className='d-flex flex-row align-items-center'>
      <Label idFor='hour-addition-group' className='m-0 mb-2 me-4 mb-sm-0'>Grupo</Label>
      <Select name='hour-addition-group' className='mb-3 w-25 me-4 mb-sm-0'>
        <option value='1' selected>1º ESO</option>
        <option value='2'>2º ESO</option>
        <option value='3'>3º ESO</option>
      </Select>

      <Label idFor='hour-addition-classroom' className='m-0 mb-2 me-4 mb-sm-0'>Aula</Label>
      <Select name='hour-addition-classroom' className='mb-3 w-25 me-4 mb-sm-0'>
        <option value='1' selected>1</option>
        <option value='2'>2</option>
        <option value='3'>3</option>
      </Select>

      <Button type='submit' level='btn-primary'>Añadir</Button>
    </form>
  )
}

export default HourAdditionForm