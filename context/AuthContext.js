import userStore from '@stores/system/userStore';
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);

  // const dispatchResetCurrentUser = userStore((state) => state.dispatchResetCurrentUser);
  // const dispatchResetCurrentUserMenus = userStore((state) => state.dispatchResetCurrentUserMenus);
  // const dispatchRemoveAccessToken = userStore((state) => state.dispatchRemoveAccessToken);
  // const dispatchRemoveRefreshToken = userStore((state) => state.dispatchRemoveRefreshToken);

  const dispatchLogout = userStore((state) => state.dispatchLogout);

  // Logs out the user by removing their access and refresh tokens and user information from local storage
  const handleLogout = async () => {
    try {
      setIsLoading(true);

      await dispatchLogout();
    } catch (error) {
      // Handle error case
      console.log('An error occurred while logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        setIsLoading,
        splashLoading,
        setSplashLoading,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
