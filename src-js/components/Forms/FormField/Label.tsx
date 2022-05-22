import React, { FC, ReactNode } from 'react'

interface IProps {
  idFor: string
  children: ReactNode
}

const Label: FC<IProps> = ({ idFor, children }) => {
  return (
    <label htmlFor={idFor} className="form-label">{children}</label>
  )
}

export default Label