import { useState } from 'react'

const useApi = <T> () => {
  const [response, setResponse] = useState<T>()
  const [pending, setPending] = useState(false)

  const doRequest = async (url: string, requestProps: RequestInit = {}) => {
    setPending(true)
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      ...requestProps
    })
    const object = await response.json()
    console.log(object)
    setPending(false)
    setResponse(object)
  }

  return { response, doRequest, pending }
}

export default useApi
