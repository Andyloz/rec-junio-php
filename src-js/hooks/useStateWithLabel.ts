import { useDebugValue, useState } from 'react'

const useStateWithLabel = <S> (label: string, initialValue: S) => {
  const [value, setValue] = useState<S>(initialValue)
  useDebugValue(`${ label }: ${ value }`)
  return [value, setValue]
}

export default useStateWithLabel
