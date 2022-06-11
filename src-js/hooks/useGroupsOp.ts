import { useState } from 'react'
import { useFetchWith } from './useFetch'
import Message from '../components/shapes/Message'

export type AddCoGroups = { 'id_horario': number, 'usuario': number, 'grupo': number, 'nombre': string }
export type GroupActionMsg = Message<'info' | 'error' | 'warning'>
export type GroupResponse =
  | { 'msg': string }
  | { 'error': string }
  | { 'success-msg': string }
  | { msg: string, 'groups-in-classroom': AddCoGroups[] }

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

const useGroupsOp = () => {
  const { doRequest: removeGroupReq } = useFetchWith.bodyParams<RmGroupReq, GroupResponse>(
    'api/remove-group-in-hour', { method: 'DELETE' },
  )
  const { doRequest: addGroupReq } = useFetchWith.bodyParams<AddGroupReq, GroupResponse>(
    'api/insert-group-in-hour',
  )
  const [msg, setMsg] = useState<GroupActionMsg>()
  const removeMsg = () => setMsg(undefined)

  const [coGroups, setCoGroups] = useState<AddCoGroups[]>()
  const removeCoGroups = () => setCoGroups(undefined)

  const handleResponse = (res: GroupResponse) => {
    if ('error' in res) {
      setMsg({ content: res['error'], type: 'error' })
    } else if ('success-msg' in res) {  // success
      setMsg({ content: res['success-msg'], type: 'info' })
    } else if ('msg' in res) {
      setMsg({ content: res['msg'], type: 'warning' })
      if ('groups-in-classroom' in res) {
        setCoGroups(res['groups-in-classroom'])
      }
    }
  }

  const addGroup = (params: AddGroupReq) => {
    setLastParams(params)
    return addGroupReq(params).then(handleResponse)
  }

  const rmGroup = (params: RmGroupReq) =>
    removeGroupReq(params).then(handleResponse)

  const [lastParams, setLastParams] = useState<AddGroupReq>()
  const repeatLastAddGroup = () => {
    if (!lastParams) {
      console.log('No params to repeat last addGroup request')
      return Promise.resolve()
    }
    return addGroup(lastParams)
  }

  return { addGroup, rmGroup, msg, removeMsg, coGroups, removeCoGroups, repeatLastAddGroup }
}

export default useGroupsOp