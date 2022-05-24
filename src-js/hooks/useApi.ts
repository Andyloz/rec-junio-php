import { useState } from 'react'

const useApi = <T> () => {
  const [response, setResponse] = useState<T>()

  const doRequest = async (url: string, requestProps: RequestInit = {}) => {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...requestProps
    })
    const object = await response.json()
    setResponse(object)
  }

  return { response, doRequest }
}

export default useApi
