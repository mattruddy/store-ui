import { Plugins } from '@capacitor/core';
import Axios from 'axios';
import { vars } from './env';

const { Storage } = Plugins;

const TOKEN = 'token';
const HAS_LOGGED_IN = 'hasLoggedIn';

export const getUserData = async () => {
  const response = await Promise.all([
    Storage.get({ key: HAS_LOGGED_IN }),
    Storage.get({ key: TOKEN })
  ]);
  const isLoggedIn = await response[0].value === 'true';
  const token = await response[1].value || undefined;
  const data = {
    isLoggedIn,
    token,
  }
  return data;
}

export const postSignup = async (
    username: string,
    password: string,
    email: string
) => {
    try {
        const response = await Axios.request({
            url: `${vars().env.API_URL}/public/signup`,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {
                username: username, 
                password: password,
                email: email,
            }
        })
        const {data} = response;
        return data;
    } catch (e) {
        return e.response;
    }
}

export const postLogin = async (
    username: string,
    password: string,
) => {
    try {
      const response = await Axios.request({
        url: `${vars().env.API_URL}/public/login`,
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: {
          username: username, 
          password: password,
        }
      });
      const { data } = response;
      return data;
    } catch (e) {
      const {data} = e.response;
      throw data
    }
}

export const setIsLoggedInData = async (isLoggedIn: boolean) => {
  await Storage.set({ key: HAS_LOGGED_IN, value: JSON.stringify(isLoggedIn) });
}

export const setTokenData = async (token: string | undefined) => {
    console.log(token);
    if (!token) {
      await Storage.remove({ key: TOKEN });
    } else {
      await Storage.set({ key: TOKEN, value: token });
    }
}