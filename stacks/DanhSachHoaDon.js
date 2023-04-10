import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import languageStore from '@stores/system/languageStore';
import { useTranslation } from 'react-i18next';

import { Header } from '@components';
import { DanhSachHoaDonScreen } from '@screens';

const Stack = createStackNavigator();

const DanhSachHoaDon = (props) => {
  const { t, i18n } = useTranslation();
  const language = languageStore((state) => state.language);
  const [title, setTitle] = useState('Danh sách hóa đơn');

  useEffect(() => {
    i18n.changeLanguage(language);

    setTitle('Đơn hàng đã bán');

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
        component={DanhSachHoaDonScreen}
        options={{
          header: ({ navigation, scene }) => <Header title={title} back navigation={navigation} scene={scene} />,
          cardStyle: { backgroundColor: '#F8F9FE' },
          headerTransparent: false,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default DanhSachHoaDon;
