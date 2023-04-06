import axiosClient from '@interceptors/axiosClient';
import connectionStore from '@stores/system/connectionStore';
import userStore from '@stores/system/userStore';

const LOGIN = '/login';
const LOGOUT = '/logout';

// export const handleLogin = async (params) => {
//   const res = await axiosClient.post(
//     `${LOGIN}/checklogin`,
//     {
//       ...params,
//     },
//     { authorization: false }
//   );
//   if (res) return res.data;
//   else return null;
// };

// export const getUserInfo = async () => {
//   const res = await axiosClient.get(`${LOGIN}/getUserInfo`);
//   if (res) return res.data;
//   else return null;
// };

export const handleLogin = async (params) => {
  const apiConnection = connectionStore.getState().apiConnection;

  const headerConfig = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...params }),
  };
  try {
    const response = await fetch(`${apiConnection.baseUrl}${LOGIN}/check-login`, headerConfig);
    if (response && response.ok) {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const getUserInfo = async () => {
  const apiConnection = connectionStore.getState().apiConnection;
  const token = userStore.getState().accessToken;

  const headerConfig = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  headerConfig.headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(`${apiConnection.baseUrl}${LOGIN}/user-info`, headerConfig);
    if (response && response.ok) {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const handleLogout = async () => {
  const res = await axiosClient.post(`${LOGOUT}`, {});
  if (res) return res.data;
  else return null;
};
