import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const cartStore = create(
  persist(
    (set) => ({
      cart: [],

      dispatchSetCart: (cart) => set({ cart }),
    }),
    {
      name: 'CART', // unique name
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default cartStore;
