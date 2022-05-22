import React, { FC } from 'react'
import Input from './Input'
import Label from './Label'

interface IProps {
  type: 'text' | 'password'
  name: string
  label: string
  maxLength?: number
}

const FormField:FC<IProps> = ({type, name, label, maxLength}) => {
  return (
    <div className="mb-3">
      <Label idFor={name}>{label}</Label>
      <Input type={type} name={name} maxLength={maxLength} />
    </div>
  )
}

export default FormField