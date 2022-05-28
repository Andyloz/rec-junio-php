import { useState } from 'react'

const useApi = <T>() => {
  const [response, setResponse] = useState<T>()
  const [pending, setPending] = useState(false)

  const doRequest = async (url: string, requestProps: RequestInit = {}) => {
    setPending(true)
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      ...requestProps,
    })
    const text = await response.text()
    const object = JSON.parse(text)
    setPending(false)
    setResponse(object)
  }

  return { response, doRequest, pending }
}

export default useApi

// useApi2

export async function baseDoRequest<R>(url: string, requestProps: RequestInit = {}): Promise<R> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...requestProps,
  })
  const text = await response.text()
  return JSON.parse(text) as R
}

export function useApi2Base<R>() {
  const [pending, setPending] = useState(false)

  function doRequest(url: string, requestProps: RequestInit = {}) {
    setPending(true)
    return baseDoRequest<R>(url, requestProps)
      .then(result => {
        setPending(false)
        return result
      })
  }

  return { doRequest, pending }
}

export function useApi2 <R>(url: string, requestProps: RequestInit = {}) {
  const { doRequest: hookDoRequest, pending } = useApi2Base<R>()
  const doRequest = () => hookDoRequest(url, requestProps)
  return { doRequest, pending }
}

export type ParametrizedUrl<P> = (params: P) => string

export function buildParametrizedUrl<P>(url: TemplateStringsArray, ...tParams: Extract<keyof P, string>[]) {
  return (params: P) => tParams.reduce((prev, curr, i) => prev + params[curr] + url[i + 1], url[0])
}

const url = buildParametrizedUrl<{ id: number }>`https://api.example.com/users/${ 'id' }`

export const useApi2With = {
  bodyParams<P, R = void>(url: string, requestProps: RequestInit = {}) {
    const { doRequest: hookDoRequest, pending } = useApi2Base<R>()
    const doRequest = (params: P) => hookDoRequest(url, {
      method: 'POST',
      body: JSON.stringify(params),
      ...requestProps,
    })
    return { doRequest, pending }
  },

  urlPlaceholders<P, R = void>(paramUrl: ParametrizedUrl<P>, requestProps: RequestInit = {}) {
    const { doRequest: hookDoRequest, pending } = useApi2Base<R>()
    const doRequest = (params: P) => hookDoRequest(paramUrl(params), requestProps)
    return { doRequest, pending }
  },
}
