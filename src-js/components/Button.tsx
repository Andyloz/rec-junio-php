import React, { FC, ReactNode } from 'react'

interface IProps {
  type: 'button' | 'submit'
  level: 'btn-primary' | 'btn-secondary'
  children: ReactNode
}

const Button: FC<IProps> = ({ type, level, children }) => {
  return (
    <button type={type} className={'btn ' + level}>{children}</button>
  )
}

export default Button