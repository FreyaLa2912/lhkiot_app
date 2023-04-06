import React from 'react';
import { withTranslation } from 'react-i18next';
import '../translation/i18n';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import _ from 'lodash';

import userStore from '@stores/system/userStore';

import { LoginScreen } from '@screens';
import AppStack from './AppStack';

const LandingStack = (props) => {
  const currentUser = userStore((state) => state.currentUser);

  return (
    <Stack.Navigator
      screenOptions={{
        mode: 'card',
        headerShown: false,
      }}
    >
      {!_.isEmpty(currentUser) ? (
        <Stack.Screen name="App" component={AppStack} />
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
};

export default withTranslation()(LandingStack);
