import { Block, Text, theme } from 'galio-framework';
import React from 'react';
import { Dimensions, Image, ImageBackground, StatusBar, StyleSheet } from 'react-native';

const { height, width } = Dimensions.get('screen');

import Images from '@constants/Images';

const OnboardingScreen = ({ navigation }) => {
  return (
    <Block flex style={styles.container}>
      <StatusBar hidden />
      <Block flex center>
        <ImageBackground source={Images.Onboarding} style={{ height, width, zIndex: 1 }} />
      </Block>
      <Block center>
        <Image source={Images.LogoOnboarding} style={styles.logo} />
      </Block>
      <Block flex space="between" style={styles.padded}>
        {/* <Block flex space="around" style={{ zIndex: 2 }}> */}
        <Block flex style={{ zIndex: 2 }}>
          <Block style={styles.title}>
            <Block>
              <Text color="white" size={50}>
                LHKIOT
              </Text>
            </Block>
            <Block>
              <Text color="white" size={30}>
                {/* COMPANY LIMITED */}
              </Text>
            </Block>
            <Block style={styles.subTitle}>
              <Text color="white" size={16}>
                {/* Lô B3, Khu Công nghiệp Bá Thiện II, Xã Thiện Kế, Huyện Bình Xuyên, Tỉnh Vĩnh Phúc, Việt Nam */}
              </Text>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK,
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: 'relative',
    bottom: theme.SIZES.BASE,
    zIndex: 2,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  logo: {
    // width: 200,
    // height: 60,
    zIndex: 2,
    position: 'relative',
    marginTop: '-70%',
  },
  title: {
    marginTop: '-5%',
  },
  subTitle: {
    marginTop: 20,
  },
});

export default OnboardingScreen;
