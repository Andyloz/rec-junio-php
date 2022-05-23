import React, { FC } from 'react'
import Input from './Input'
import Label from './Label'

interface IProps {
  type: 'text' | 'password'
  name: string
  label: string
  maxLength?: number
  placeholder?: string
}

const FormField: FC<IProps> = ({ type, name, label, maxLength, placeholder }) => {
  return (
    <div className='mb-3'>
      <Label idFor={name}>{label}</Label>
      <Input type={type} name={name} maxLength={maxLength} placeholder={placeholder} />
    </div>
  )
}

export default FormField