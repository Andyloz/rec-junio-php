import React, { FC, InputHTMLAttributes } from 'react'

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  labelText: string
}

const FormField: FC<IProps> = ({ name, labelText, ...otherProps }) => {
  return (
    <div className='mb-3'>
      <label htmlFor={ name }>{ labelText }</label>
      <input className='form-control' id={ name } name={ name } { ...otherProps } />
    </div>
  )
}

export default FormField
