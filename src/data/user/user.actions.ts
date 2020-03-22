import { setTokenData, setIsLoggedInData, getUserData } from "../dataApi";
import { ActionType } from '../../util/types';
import { UserState } from "./user.state";

export const loadUserData = () => async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true));
  const data = await getUserData();
  dispatch(setData(data));
  dispatch(setLoading(false));
}

export const setToken = (token?: string) => async (dispatch: React.Dispatch<any>) => {
    await setTokenData(token);
    return ({
      type: 'set-token',
      token
    } as const);
};

export const setIsLoggedIn = (loggedIn: boolean) => async (dispatch: React.Dispatch<any>) => {
  await setIsLoggedInData(loggedIn);
  return ({
    type: 'set-is-loggedin',
    loggedIn
  } as const)
};

export const setLoading = (isLoading: boolean) => ({
  type: 'set-user-loading',
  isLoading
} as const);

export const setData = (data: Partial<UserState>) => ({
  type: 'set-user-data',
  data
} as const);

export type UserActions =
  | ActionType<typeof setLoading>
  | ActionType<typeof setData>
  | ActionType<typeof setToken>
  | ActionType<typeof setIsLoggedIn>