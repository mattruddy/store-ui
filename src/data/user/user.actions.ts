import { setTokenData } from "../dataApi";
import { ActionType } from '../../util/types';

export const setToken = (token?: string) => async (dispatch: React.Dispatch<any>) => {
    await setTokenData(token);
    return ({
      type: 'set-token',
      token
    } as const);
};

export type UserActions =
  | ActionType<typeof setToken>