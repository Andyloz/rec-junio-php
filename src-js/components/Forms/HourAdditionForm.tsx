import React from 'react'
import Button from '../Button'
import Label from './FormField/Label'

const HourAdditionForm = () => {

  return (
    <form method='post' className='d-flex flex-row align-items-center'>
      <Label idFor='hour-addition-group' className='m-0 mb-2 me-4 mb-sm-0'>Grupo</Label>
      <select id='hour-addition-group' name='hour-addition-group' className='form-select mb-3 w-25 me-4 mb-sm-0'
              style={ { maxWidth: 'max-content' } }>
        <option value='1' selected>1º ESO</option>
        <option value='2'>2º ESO</option>
        <option value='3'>3º ESO</option>
      </select>

      <Label idFor='hour-addition-classroom' className='m-0 mb-2 me-4 mb-sm-0'>Aula</Label>
      <select id='hour-addition-classroom' name='hour-addition-classroom' className='form-select mb-3 w-25 me-4 mb-sm-0'
              style={ { maxWidth: 'max-content' } }>
        <option value='1' selected>1</option>
        <option value='2'>2</option>
        <option value='3'>3</option>
      </select>

      <Button type='submit' level='btn-primary'>Añadir</Button>
    </form>
  )
}

export default HourAdditionForm