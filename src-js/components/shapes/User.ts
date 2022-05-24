import UserType from './UserType'

interface User {
  id_usuario: number
  nombre: string
  usuario: string
  email: string
  tipo: UserType
}

export default User
