import { useState } from 'react'
import { useFetchWith } from './useFetch'
import Message from '../components/shapes/Message'

export type GroupActionMsg = Message<'info' | 'error' | 'warning'>
export type GroupResponse = { 'msg': string } | { 'error': string } | { 'success-msg': string }

interface AddGroupReq {
  day: number,
  hour: number,
  'id-user': number,
  'id-group': number,
  'id-classroom': number
}

interface RmGroupReq {
  'id-schedule': number
}

// todo: add groups fetch

const useGroups = () => {
  const { doRequest: removeGroupReq } = useFetchWith.bodyParams<RmGroupReq, GroupResponse>(
    'api/remove-group-in-hour', { method: 'DELETE' },
  )
  const { doRequest: addGroupReq } = useFetchWith.bodyParams<AddGroupReq, GroupResponse>(
    'api/insert-group-in-hour',
  )
  const [msg, setMsg] = useState<GroupActionMsg>()

  const handleResponse = (res: GroupResponse) => {
    if ('msg' in res) {
      setMsg({ content: res['msg'], type: 'warning' })
    } else if ('error' in res) {
      setMsg({ content: res['error'], type: 'error' })
    } else {  // success
      setMsg({ content: res['success-msg'], type: 'info' })
    }
  }

  const addGroup = (params: AddGroupReq) =>
    addGroupReq(params).then(handleResponse)

  const rmGroup = (params: RmGroupReq) =>
    removeGroupReq(params).then(handleResponse)

  const removeMsg = () => setMsg(undefined)

  return { addGroup, rmGroup, msg, removeMsg }
}

export default useGroups