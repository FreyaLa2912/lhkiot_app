import userStore from '@stores/system/userStore';
import connectionStore from '@stores/system/connectionStore';
import { createAxiosClient } from './createAxiosClient';

import { REFRESH_TOKEN_URL } from '@constants';

const apiConnection = connectionStore.getState().apiConnection;

const getCurrentAccessToken = () => {
  // this is how you access the zustand store outside of React.
  const accessToken = userStore.getState().accessToken;
  return accessToken;
};

const getCurrentRefreshToken = () => {
  // this is how you access the zustand store outside of React.
  const refreshToken = userStore.getState().refreshToken;
  return refreshToken;
};

const setNewTokens = (accessToken, refreshToken) => {
  const dispatchSetAccessToken = userStore.getState().dispatchSetAccessToken;
  const dispatchSetRefreshToken = userStore.getState().dispatchSetRefreshToken;
  dispatchSetAccessToken(accessToken);
  dispatchSetRefreshToken(refreshToken);
};

const removeAllTokens = () => {
  const dispatchRemoveAccessToken = userStore.getState().dispatchRemoveAccessToken;
  const dispatchRemoveRefreshToken = userStore.getState().dispatchRemoveRefreshToken;
  dispatchRemoveAccessToken();
  dispatchRemoveRefreshToken();
};

const setAccessToken = (accessToken) => {
  const dispatchSetAccessToken = userStore.getState().dispatchSetAccessToken;
  dispatchSetAccessToken(accessToken);
};

const setRefreshToken = (refreshToken) => {
  const dispatchSetRefreshToken = userStore.getState().dispatchSetRefreshToken;
  dispatchSetRefreshToken(refreshToken);
};

const logout = async () => {
  const dispatchLogout = userStore.getState().dispatchLogout;
  dispatchLogout();
};

const axiosClient = createAxiosClient({
  options: {
    baseURL: apiConnection.baseUrl,
    timeout: 300000,
    headers: {
      'Content-Type': 'application/json',
    },
  },
  getCurrentAccessToken,
  getCurrentRefreshToken,
  refreshTokenUrl: REFRESH_TOKEN_URL,
  logout,
  setNewTokens,
  removeAllTokens,
  setAccessToken,
  setRefreshToken,
});

export default axiosClient;
