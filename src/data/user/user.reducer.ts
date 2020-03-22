import { UserActions } from './user.actions';
import { UserState } from './user.state';

export function userReducer(state: UserState, action: UserActions): UserState {
  switch (action.type) {
    case 'set-user-loading':
      return { ...state, loading: action.isLoading };
    case 'set-user-data':
      return { ...state, ...action.data };
    case 'set-token':
      return { ...state, token: action.token };
    case 'set-is-loggedin':
      return { ...state, isLoggedIn: action.loggedIn };
  }
}