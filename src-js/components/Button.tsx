import React, { FC, ReactNode } from 'react'

interface IProps {
  type: 'button' | 'submit'
  children: ReactNode
}

const Button: FC<IProps> = ({ type, children }) => {
  return (
    <button type={type} className="btn btn-primary">{children}</button>
  )
}

export default Button