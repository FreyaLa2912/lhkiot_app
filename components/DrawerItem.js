import { Block, Text, theme } from 'galio-framework';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import languageStore from '@stores/system/languageStore';
// import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import argonTheme from '@constants/Theme';
import Icon from './Icon';

import { AuthContext } from '@context';

const DrawerItem = ({ focused, title, text, navigation }) => {
  const { handleLogout } = useContext(AuthContext);
  const language = languageStore((state) => state.language);
  const dispatchChangeLanguage = languageStore((state) => state.dispatchChangeLanguage);

  const sign_out = 'sign_out';

  const renderIcon = () => {
    switch (title) {
      case 'sign_out':
        return <Icon name="switch" family="IconCollection" size={18} color={focused ? 'white' : 'rgba(0,0,0,0.5)'} />;
      case 'ChangePassword':
        return <Icon name="key" family="IconCollection" size={18} color={focused ? 'white' : 'rgba(0,0,0,0.5)'} />;
      case 'language':
        return <Icon name="earth" family="IconCollection" size={18} color={focused ? 'white' : 'rgba(0,0,0,0.5)'} />;
      default:
        return (
          <Icon
            name="price-tags"
            family="IconCollection"
            size={18}
            color={focused ? argonTheme.COLORS.WHITE : 'rgba(0,0,0,0.5)'}
          />
          // <FontAwesome5 name="home" size={20} color={focused ? 'white' : argonTheme.COLORS.PRIMARY} />
        );
    }
  };

  const containerStyles = [styles.defaultStyle, focused ? [styles.activeStyle, styles.shadow] : null];

  return (
    <TouchableOpacity
      style={{ height: 60 }}
      onPress={() => {
        switch (title) {
          case sign_out:
            handleLogout();
            break;
          case 'language':
            language === 'EN' ? dispatchChangeLanguage('VI') : dispatchChangeLanguage('EN');
            break;
          default:
            navigation.navigate(title);
        }
      }}
    >
      <Block flex row style={containerStyles}>
        <Block middle flex={0.1} style={{ marginRight: 5 }}>
          {renderIcon()}
        </Block>
        <Block row center flex={0.9}>
          <Text size={15} bold={focused ? true : false} color={focused ? argonTheme.COLORS.WHITE : 'rgba(0,0,0,0.5)'}>
            {text}
          </Text>
        </Block>
      </Block>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  activeStyle: {
    backgroundColor: argonTheme.COLORS.ERROR,
    borderRadius: 4,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
  },
});

export default DrawerItem;
