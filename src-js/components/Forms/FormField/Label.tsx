import React, { FC, ReactNode } from 'react'

interface IProps {
  idFor: string
  className?: string
  children: ReactNode
}

const Label: FC<IProps> = ({ idFor, className, children }) => {
  return (
    <label htmlFor={idFor} className={'form-label ' + className}>{children}</label>
  )
}

export default Label