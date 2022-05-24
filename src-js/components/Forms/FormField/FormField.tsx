import React, { FC, InputHTMLAttributes } from 'react'
import Label from './Label'

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  labelText: string
}

const FormField: FC<IProps> = ({ name, labelText, ...otherProps }) => {
  return (
    <div className='mb-3'>
      <Label idFor={ name }>{ labelText }</Label>
      <input className='form-control' id={ name } { ...otherProps } />
    </div>
  )
}

export default FormField
