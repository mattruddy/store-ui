import { UserActions } from "./user.actions"
import { UserState } from "./user.state"

export function userReducer(state: UserState, action: UserActions): UserState {
  switch (action.type) {
    case "set-user-loading":
      return { ...state, loading: action.isLoading }
    case "set-user-data":
      return { ...state, ...action.data }
    case "set-token":
      return { ...state, token: action.token }
    case "set-is-loggedin":
      return { ...state, isLoggedIn: action.loggedIn }
    case "set-has-read":
      return { ...state, hasRead: action.hasReadInstall }
    case "set-profile":
      return { ...state, pwas: action.pwas }
    case "set-username":
      return { ...state, username: action.username }
    case "replace-app":
      return {
        ...state,
        pwas: state.pwas
          ? [
              action.app,
              ...state.pwas.filter((x) => x.appId !== action.app.appId),
            ]
          : undefined,
      }
    case "add-app":
      return {
        ...state,
        pwas: state.pwas ? [...state.pwas, action.app] : [action.app],
      }
    case "remove-app":
      return {
        ...state,
        pwas: state.pwas
          ? [...state.pwas.filter((x) => x.appId !== action.appId)]
          : undefined,
      }
  }
}
