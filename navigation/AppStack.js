import { HttpTransportType, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, Dimensions, SafeAreaView } from 'react-native';

import CustomDrawerContent from './CustomDrawerContent';

import { OnboardingScreen } from '@screens';

import { dateToTicks } from '@utils';

import * as AllStacks from '@stacks';

import userStore from '@stores/system/userStore';
import connectionStore from '@stores/system/connectionStore';

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get('screen');

const StackWrapper = (name, index, title) => {
  const DrawerSceenComponent = AllStacks[name];

  return DrawerSceenComponent ? (
    <Drawer.Screen
      name={title}
      component={AllStacks[name]}
      key={index}
      options={{
        headerShown: false,
        //drawerIcon: () => <Ionicons name="checkmark-outline" size={22} style={{ color: '#ffffff' }} />,
      }}
    />
  ) : null;
};

const AppStack = (props) => {
  let isRendered = useRef(false);
  const onlineUsersRef = useRef();
  const appState = useRef(AppState.currentState);
  const changePasswordScreenId = dateToTicks(new Date());

  ////userStore
  const currentUser = userStore((state) => state.currentUser);
  const dispatchRemoveCurrentUser = userStore((state) => state.dispatchRemoveCurrentUser);
  const currentUserMenus = userStore((state) => state.currentUserMenus);
  const accessToken = userStore((state) => state.accessToken);
  const dispatchLogout = userStore((state) => state.dispatchLogout);
  const dispatchSetKickOutState = userStore((state) => state.dispatchSetKickOutState);

  ////connectionStore
  const apiConnection = connectionStore((state) => state.apiConnection);

  const initConnection = new HubConnectionBuilder()
    .withUrl(`${apiConnection.rootUrl}/signalr`, {
      accessTokenFactory: () => accessToken,
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
    })
    .configureLogging(LogLevel.None)
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        //reconnect after 5-20s
        return 5000 + Math.random() * 15000;
      },
    })
    .build();

  const [drawerRender, setDrawerRender] = useState([]);
  const [connection, setConnection] = useState(initConnection);
  const [onLineUsers, setOnlineUsers] = useState([]);

  const getUserMenus = async () => {
    if (currentUserMenus && currentUserMenus.length) {
      const drawerRenderList = currentUserMenus.map((item) => {
        return StackWrapper(item.menuComponent, item.menuId, item.menuComponent);
      });

      drawerRenderList.push(StackWrapper('ChangePassword', changePasswordScreenId, 'ChangePassword'));
      drawerRenderList.push(StackWrapper('KetThucDonHang', 1, 'KetThucDonHang'));

      if (isRendered) setDrawerRender([...drawerRenderList]);
    }
  };

  const startConnection = async () => {
    try {
      if (connection) {
        try {
          connection.on('ReceivedOnlineUsers', (data) => {
            if (connection.state === HubConnectionState.Connected && isRendered) {
              setOnlineUsers(data ? [...data] : []);
            }
          });

          // connection.stop().then(() => {
          //   try {
          //     connection.start().then(() => {
          //       if (connection.state === HubConnectionState.Connected) {
          //         // Handle the method invocation
          //          connection.invoke('SendOnlineUsers');
          //       }
          //     });
          //   } catch (error) {
          //     console.log('connection start error: ', JSON.stringify(error));
          //     dispatchRemoveCurrentUser();
          //   }
          // });

          await connection.stop();
          await connection.start();
          await connection.invoke('SendOnlineUsers');
        } catch (error) {
          // setConnection(null);
          // dispatchLogout();
          dispatchRemoveCurrentUser();
          console.log('connection build error: ', JSON.stringify(error));
        }
      }
    } catch (error) {
      console.log('websocket connect error:', JSON.stringify(error));
    }
  };

  const closeConnection = async () => {
    try {
      if (connection) {
        await Promise.all([connection.off('ReceivedOnlineUsers')]);

        connection.stop();

        // connection.stop().then(() => {
        //   setConnection(null);
        // });
      }
    } catch (error) {
      console.log('close connection error:', JSON.stringify(error));
    }
  };

  const handleAppStateChange = async (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      //// App has come to the foreground!
      await startConnection();
    } else {
      //// App has gone to the background or become inactive!
      await closeConnection();
    }
    appState.current = nextAppState;
  };

  const kickOut = async () => {
    const checkOnlineUsers = onLineUsers.find(
      (item) => item.userId === currentUser.userId && item.lastLoginOnApp === currentUser.lastLoginOnApp
    );
    if (!checkOnlineUsers && onlineUsersRef.current && onlineUsersRef.current.length) {
      await closeConnection();
      dispatchSetKickOutState(true);
      dispatchLogout();
    }
  };

  useEffect(() => {
    isRendered = true;

    startConnection();

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      setOnlineUsers([]);
      subscription.remove();
      closeConnection();

      isRendered = false;
    };
  }, []);

  useEffect(() => {
    if (currentUserMenus.length > 0) {
      getUserMenus();
    }
  }, [currentUserMenus, currentUserMenus.length]);

  useEffect(() => {
    onlineUsersRef.current = onLineUsers;
    kickOut();
  }, [onLineUsers]);
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: 'white',
        width: width * 0.8,
      }}
      screenOptions={{
        activeTintcolor: 'white',
        inactiveTintColor: '#000',
        activeBackgroundColor: 'transparent',
        itemStyle: {
          width: width * 0.75,
          backgroundColor: 'transparent',
          paddingVertical: 6,
          paddingHorizonal: 12,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: 'normal',
        },
      }}
      // initialRouteName="Home"
    >
      {drawerRender.length ? (
        drawerRender
      ) : (
        <Drawer.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Drawer.Navigator>
  );
};

export default AppStack;
