import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import languageStore from '@stores/system/languageStore';
import { useTranslation } from 'react-i18next';

import { Header } from '@components';
import { BanHangScreen, KetThucDonHangScreen } from '@screens';

const Stack = createStackNavigator();

const BanHang = (props) => {
  const { t, i18n } = useTranslation();
  const language = languageStore((state) => state.language);
  const [title, setTitle] = useState('Bán hàng');

  useEffect(() => {
    i18n.changeLanguage(language);

    setTitle('Bán hàng');

    return () => {};
  }, [language]);

  return (
    <Stack.Navigator
      screenOptions={{
        mode: 'card',
        headerShown: 'screen',
      }}
    >
      <Stack.Screen
        name={title}
        component={BanHangScreen}
        options={{
          header: ({ navigation, scene }) => <Header title={title} navigation={navigation} scene={scene} />,
          cardStyle: { backgroundColor: '#F8F9FE' },
          headerTransparent: false,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default BanHang;
