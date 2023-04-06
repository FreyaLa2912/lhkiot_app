import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import connectionStore from '@stores/system/connectionStore';
import { USER_INFO } from '@constants';

const handleLogout = async (token) => {
  const apiConnection = connectionStore.getState().apiConnection;

  const config = {
    withCredentials: false,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  config.headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${apiConnection.baseUrl}/logout`, config);
  // console.log('response logout: ', response);

  if (response.ok) {
    return await response.json();
  } else {
    return {
      HttpResponseCode: 450,
      ResponseMessage: 'Method Not Allowed',
    };
  }
};

const userStore = create(
  persist(
    (set, get) => ({
      currentUser: {},
      currentUserMenus: [],
      accessToken: null,
      refreshToken: null,
      kickOutState: true,

      ////USER ACTIONS
      dispatchSetCurrentUser: (user) => set(() => ({ currentUser: user })),
      dispatchRemoveCurrentUser: () => set(() => ({ currentUser: {} })),

      ////MENU ACTIONS
      dispatchSetCurrentUserMenus: (menus) => set(() => ({ currentUserMenus: [...menus] })),
      dispatchRemoveCurrentUserMenus: () => set(() => ({ currentUserMenus: [] })),

      ////TOKEN ACTIONS
      dispatchSetAccessToken: (access_token) => set(() => ({ accessToken: access_token })),
      dispatchRemoveAccessToken: () => set({ accessToken: null }),

      dispatchSetRefreshToken: (refresh_token) => set(() => ({ refreshToken: refresh_token })),
      dispatchRemoveRefreshToken: () => set({ refreshToken: null }),

      ////LOG OUT
      dispatchLogout: async () => {
        const token = get().accessToken ?? 'logout_token';

        await handleLogout(token);

        // if (res?.HttpResponseCode === 200 && res.ResponseMessage === 'general.success') {
        //   await Promise.all([set({ accessToken: null }), set({ refreshToken: null }), set({ currentUserMenus: [] })]);
        //   set({ currentUser: {} });
        // }

        await Promise.all([set({ accessToken: null }), set({ refreshToken: null }), set({ currentUserMenus: [] })]);
        set({ currentUser: {} });
      },

      ////KICK OUT
      dispatchSetKickOutState: (flag) => set({ kickOutState: flag }),
    }),
    {
      name: USER_INFO, // unique name
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default userStore;
