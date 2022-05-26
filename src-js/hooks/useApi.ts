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
    const text = await response.text()
    console.log(text)
    const object = JSON.parse(text)
    setPending(false)
    setResponse(object)
  }

  return { response, doRequest, pending }
}

export default useApi
