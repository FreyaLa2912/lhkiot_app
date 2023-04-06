import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import languageStore from '@stores/system/languageStore';
import { useTranslation } from 'react-i18next';

import { Header } from '@components';
import { ChangePasswordScreen } from '@screens';

const Stack = createStackNavigator();

const ChangePassword = (props) => {
  const { t, i18n } = useTranslation();
  const language = languageStore((state) => state.language);
  const [title, setTitle] = useState(t(`menu.ChangePassword`));

  useEffect(() => {
    i18n.changeLanguage(language);

    setTitle(t(`menu.ChangePassword`));

    return () => {};
  }, [language]);

  return (
    <Stack.Navigator
      screenOptions={{
        mode: 'card',
        headerShown: 'screen',
      }}
    >
      {/* <Stack.Screen
        name={title}
        component={ChangePasswordScreen}
        options={{
          header: ({ navigation, scene }) => <Header title={title} navigation={navigation} scene={scene} />,
          cardStyle: { backgroundColor: '#F8F9FE' },
          headerTransparent: false,
        }}
      /> */}

      <Stack.Screen
        name={title}
        component={ChangePasswordScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header transparent white title={title} back navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: '#FFFFFF' },
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default ChangePassword;
