import { Block, Text, theme } from 'galio-framework';
import { Image, ScrollView, StyleSheet } from 'react-native';

import { DrawerItem as DrawerCustomItem } from '@components';
import Images from '@constants/Images';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import languageStore from '@stores/system/languageStore';
import userStore from '@stores/system/userStore';

const CustomDrawerContent = ({ drawerPosition, navigation, profile, focused, state, ...props }) => {
  const sign_out = 'sign_out';
  const [screens, setScreens] = useState([]);

  const { t, i18n } = useTranslation();
  const language = languageStore((state) => state.language);

  const currentUserMenus = userStore((state) => state.currentUserMenus);

  const getScreensArr = async () => {
    if (currentUserMenus && currentUserMenus.length) {
      const renderList = currentUserMenus.map((item) => {
        return `${item.menuComponent}`;
      });
      setScreens([...renderList]);
    }
  };

  useEffect(() => {
    i18n.changeLanguage(language);
    return () => {};
  }, [language]);

  useEffect(() => {
    getScreensArr();
  }, [currentUserMenus.length]);

  return (
    <Block style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
      <Block flex={0.05} style={styles.header}>
        {/* <Image styles={styles.logo} source={Images.Logo} /> */}
        <Text>LHKIOT</Text>
      </Block>
      <Block flex style={{ paddingLeft: 8, paddingRight: 14 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={true}>
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                title={item}
                text={t(`menu.${item}`)}
                key={index}
                navigation={navigation}
                focused={state.index === index ? true : false}
              />
            );
          })}
        </ScrollView>
      </Block>
      <Block flex={0.4} style={{ marginTop: 24, marginVertical: 8, paddingHorizontal: 8 }}>
        <Block
          style={{
            borderColor: 'rgba(0,0,0,0.2)',
            width: '100%',
            borderWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text color="#8898AA" style={{ marginTop: 16, marginLeft: 8 }}>
          CONFIGURATION
        </Text>
        <DrawerCustomItem title="language" text={t(language === 'EN' ? 'English' : 'Tiếng Việt')} />
        <DrawerCustomItem
          title="ChangePassword"
          text={t(`menu.ChangePassword`)}
          navigation={navigation}
          focused={state.index === state.routeNames.length - 1 ? true : false}
        />
        <DrawerCustomItem title={sign_out} text={t(sign_out)} />
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE * 2,
    paddingTop: theme.SIZES.BASE * 2,
    justifyContent: 'center',
  },
});

export default CustomDrawerContent;
