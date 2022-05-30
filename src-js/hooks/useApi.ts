import { useState } from 'react'

async function baseDoRequest<R>(url: string, requestProps: RequestInit = {}): Promise<R> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...requestProps,
  })
  const text = await response.text()
  return JSON.parse(text) as R
}

function useApi2Base<R>() {
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
