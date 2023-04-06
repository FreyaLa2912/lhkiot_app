import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import _ from 'lodash';

import { CURRENT_LANGUAGE } from '@constants';

const languageStore = create(
  persist(
    (set) => ({
      language: 'EN',
      dispatchChangeLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: CURRENT_LANGUAGE, // unique name
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default languageStore;
