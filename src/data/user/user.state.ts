import { PWA } from "../../util/types"

export interface UserState {
  isLoggedIn: boolean
  token?: string
  loading: boolean
  hasRead?: string
  pwas?: PWA[]
  username?: string
  email?: string
}
