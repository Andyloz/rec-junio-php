import React, { ButtonHTMLAttributes, FC, ReactNode } from 'react'

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  level: 'btn-primary' | 'btn-secondary'
  children: ReactNode
}

const Button: FC<IProps> = (
  { level, children, ...otherProps },
) => {
  return (
    <button className={ 'btn ' + level } { ...otherProps }>{ children }</button>
  )
}

export default Button