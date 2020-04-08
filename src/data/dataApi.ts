import { Plugins } from '@capacitor/core';
import Axios from 'axios';
import { vars } from './env';
import { PWA, UserProfile, Search } from '../util/types';

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

export const getSearchApp = async (appName: string) => {
  try {
    const response = await Axios.request({
      url: `${vars().env.API_URL}/public/search/${appName}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response.data as Search[];
  } catch (error) {
    return error.data;
  }
}

export const getPWAs = async (page: number, category?: string) => {
  try {
    const response = await Axios.request({
      url: category ? `${vars().env.API_URL}/public/pwas/${page}/${category}` : `${vars().env.API_URL}/public/pwas/${page}`,
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

export const postEmail = async (name: string, text: string) => {
  try {
    const response = await Axios.request({
      url: `${vars().env.API_URL}/public/support`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        name: name,
        text: text
      }
    });
    const {data} = response;
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
    return {
      username: data.username,
      pwas: data.pageResponses as PWA[]
    } as UserProfile
  } catch (error) {
    throw error;
  }
}

export const postScore = async (appId: number) => {
  try {
    const response = await Axios.request({
      url: `${vars().env.API_URL}/public/pwa/${appId}`,
      method: 'POST',
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

export const postAddScreenshots = async (screenshots: File[], appId: number) => {
  const token = await Storage.get({ key: TOKEN });
  if (!token) return;
  try {
    const fd = new FormData();
    screenshots.forEach(shot => fd.append("screenshots", shot));
    const response = await Axios.request({
      url: `${vars().env.API_URL}/secure/screenshot/${appId}`,
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

export const putApp = async (
  name: string,
  description: string,
  category: string,
  appId: number
) => {
  const token = await Storage.get({ key: TOKEN });
  if (!token) return;
  try {
    const response = await Axios.request({
      url: `${vars().env.API_URL}/secure/pwas/${appId}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        name: name,
        description: description,
        category: category
      }
    })

    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteScreenshot = async (imageId: number) => {
  const token = await Storage.get({ key: TOKEN });
  if (!token) return;
  try {
    const response = await Axios.request({
      url: `${vars().env.API_URL}/secure/screenshot/${imageId}`,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteApp = async (appId: number) => {
  const token = await Storage.get({ key: TOKEN });
  if (!token) return;
  try {
    const response = await Axios.request({
      url: `${vars().env.API_URL}/secure/pwas/${appId}`,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    return response;
  } catch (error) {
    throw error;
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