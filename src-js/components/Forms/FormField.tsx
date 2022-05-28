import React, { FC, InputHTMLAttributes } from 'react'

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  inputRef?: React.Ref<HTMLInputElement>
  name: string
  labelText: string
}

const FormField: FC<IProps> = ({ inputRef, name, labelText, ...otherProps }) => {
  return (
    <div className='mb-3'>
      <label htmlFor={ name }>{ labelText }</label>
      <input ref={inputRef} className='form-control' id={ name } name={ name } { ...otherProps } />
    </div>
  )
}

export default FormField
