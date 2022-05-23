import React, { FC } from 'react'

interface IProps {
  type: 'text' | 'password'
  name: string
  maxLength?: number
  placeholder?: string
}

const Input: FC<IProps> = ({ type, name, maxLength, placeholder }) => {
  return (
    <input type={type} className='form-control' id={name} name={name} maxLength={maxLength} placeholder={placeholder} />
  )
}

export default Input