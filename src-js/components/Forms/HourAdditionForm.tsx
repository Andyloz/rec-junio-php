import React from 'react'

const HourAdditionForm = () => {

  return (
    <form method='post' className='d-flex flex-row align-items-center'>
      <label htmlFor='hour-addition-group' className='form-label m-0 mb-2 me-4 mb-sm-0'>Grupo</label>
      <select id='hour-addition-group' name='hour-addition-group' className='form-select mb-3 w-25 me-4 mb-sm-0'
              style={ { maxWidth: 'max-content' } }>
        <option value='1'>1º ESO</option>
        <option value='2'>2º ESO</option>
        <option value='3'>3º ESO</option>
      </select>

      <label htmlFor='hour-addition-classroom' className='form-label m-0 mb-2 me-4 mb-sm-0'>Aula</label>
      <select id='hour-addition-classroom' name='hour-addition-classroom' className='form-select mb-3 w-25 me-4 mb-sm-0'
              style={ { maxWidth: 'max-content' } }>
        <option value='1'>1</option>
        <option value='2'>2</option>
        <option value='3'>3</option>
      </select>

      <button type='submit' className='btn btn-primary'>Añadir</button>
    </form>
  )
}

export default HourAdditionForm