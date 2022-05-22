import React, { FC } from 'react'

interface IProps {
  type: 'text' | 'password'
  name: string
  maxLength?: number
}

const Input: FC<IProps> = ({ type, name, maxLength }) => {
  return (
    <input type={type} className='form-control' id={name} name={name} maxLength={maxLength} />
  )
}

export default Input