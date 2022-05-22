import React, { FC, ReactNode } from 'react'

interface IProps {
  name: string
  className?: string
  children: ReactNode
}

const Select: FC<IProps> = ({ name, className, children }) => {
  return (
    <select className={'form-select ' + className} id={name} name={name}>{children}</select>
  )
}

export default Select