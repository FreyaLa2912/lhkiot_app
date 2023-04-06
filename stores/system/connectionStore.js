import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const initConnection = {
  companyName: 'LHKiot',
  //baseUrl: 'https://localhost:44303/api',
  //rootUrl: 'https://localhost:44303',
  baseUrl: 'https://backend.lhkiot.com/api',
  rootUrl: 'https://backend.lhkiot.com',
};

const connectionStore = create(
  persist(
    (set, get) => ({
      apiConnection: initConnection,

      dispatchSetApiConnection: (newConnection) => set(() => ({ apiConnection: newConnection })),
      dispatchResetApiConnection: () =>
        set(() => ({
          apiConnection: initConnection,
        })),
    }),
    {
      name: 'api-connection', // unique name
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default connectionStore;
