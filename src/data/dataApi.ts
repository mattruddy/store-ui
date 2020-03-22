import { Plugins } from '@capacitor/core';
import Axios from 'axios';
import { vars } from './env';

const { Storage } = Plugins;

const TOKEN = 'token';

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

export const setTokenData = async (token: string | undefined) => {
    if (!token) {
      await Storage.remove({ key: TOKEN });
    } else {
      await Storage.set({ key: TOKEN, value: token });
    }
  }