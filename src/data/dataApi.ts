import { Plugins } from '@capacitor/core';
import Axios from 'axios';
import { vars } from './env';
import { returnDownBack } from 'ionicons/icons';

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

export const getPWAs = async () => {
  try {
    const response = await Axios.request({
      url: `${vars().env.API_URL}/public/pwas`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const { data } = response;
    return data;
  } catch (error) {
    return error.response;
  }
}

export const getPWA = async (id: number) => {
  try {
    const response = await Axios.request({
      url: `${vars().env.API_URL}/public/pwa/${id}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const { data } = response;
    return data;
  } catch (error) {
    return error.response;
  }
}

export const getProfile = async () => {
  const token = await Storage.get({ key: TOKEN });
  if (!token) return;
  try {
    const response = await Axios.request({
      url: `${vars().env.API_URL}/secure/profile`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const {data} = response;
    return data;
  } catch (error) {
    throw error;
  }
}

export const postApp = async (
  name: string,
  desc: string,
  url: string,
  category: string,
  icon: File,
  screenshots: File[]
) => {
  const token = await Storage.get({ key: TOKEN });
  if (!token) return;
  try {

    const info = {
      name: name,
      description: desc,
      link: url,
      category: category
    }

    const fd = new FormData();
    fd.append("icon", icon);
    screenshots.forEach(screenshot => fd.append("screenshots", screenshot));
    fd.append("info", JSON.stringify(info));

    const response = await Axios.request({
      url: `${vars().env.API_URL}/secure/pwas`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: fd
    })
    const {data} = response;
    return data;
  } catch (error) {
    return error.response;
  }
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