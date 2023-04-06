import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import { useTranslation } from 'react-i18next';
import Spinner from 'react-native-loading-spinner-overlay';

import { Formik } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';

import { Button, Icon, Input } from '@components';
import { Images, argonTheme } from '@constants';
import { HeaderHeight } from '@constants/utils';
import { ChangePasswordDto } from '@models';

import languageStore from '@stores/system/languageStore';
import userStore from '@stores/system/userStore';

import { userService } from '@services/system';

const { width, height } = Dimensions.get('screen');

// const thumbMeasure = (width - 48 - 32) / 3;

const ChangePasswordScreen = () => {
  const { t, i18n } = useTranslation();
  const language = languageStore((state) => state.language);
  const currentUser = userStore((state) => state.currentUser);

  const [spinnerLoading, setSpinnerLoading] = useState(false);

  const getRandomInt = () => {
    return Math.floor(Math.random() * 10);
  };

  const handleChangePassword = async (params) => {
    setSpinnerLoading(true);

    const data = { ...params, userName: currentUser.userName };

    const { HttpResponseCode, ResponseMessage, Data } = await userService.changePassword(data);

    if (HttpResponseCode === 200 && ResponseMessage === 'general.success') {
      Alert.alert(t('alert_title_success'), t('user.password_changed'), [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    } else {
      Alert.alert(t('alert_title_error'), t(ResponseMessage), [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }

    setSpinnerLoading(false);
  };

  const changePasswordSchema = yup.object().shape({
    userPassword: yup.string().nullable().required('userPassword_required'),
    newPassword: yup.string().nullable().required('newPassword_required'),
    confirmPassword: yup
      .string()
      .nullable()
      .required('confirmPassword_notmatched')
      .oneOf([yup.ref('newPassword')], 'confirmPassword_notmatched'),
  });

  useEffect(() => {
    i18n.changeLanguage(language);

    return () => {};
  }, [language]);

  return (
    <Block flex style={styles.profile}>
      <Block flex>
        <ImageBackground
          source={Images.ProfileBackground}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
        >
          <Spinner visible={spinnerLoading} />
          <ScrollView showsVerticalScrollIndicator={false} style={{ width, marginTop: '50%' }}>
            <Block flex style={styles.profileCard}>
              <Block middle style={styles.avatarContainer}>
                {/* <Image source={{ uri: Images.ProfilePicture }} style={styles.avatar} /> */}
                <Image source={Images.Avatars[getRandomInt()]} style={styles.avatar} />
              </Block>

              <Block flex>
                <Block middle style={styles.nameInfo}>
                  <Text bold size={28} color="#FFFFFF">
                    {currentUser.userName}
                  </Text>
                  <Text size={16} color="#FFFFFF" style={{ marginTop: 10 }}>
                    {`ID: ${currentUser.userId}`}
                  </Text>
                </Block>
                <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                  <Block style={styles.divider} />
                </Block>
              </Block>

              <Block safe flex middle>
                <Block>
                  {/* LOGIN FORM */}
                  <Formik
                    validationSchema={changePasswordSchema}
                    initialValues={{ ...ChangePasswordDto }}
                    enableReinitialize
                    onSubmit={(values) => {
                      handleChangePassword(values);
                    }}
                  >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => {
                      {
                        /* console.log('errors: ', errors); */
                      }
                      return (
                        <Block flex={0.7} middle style={{ marginTop: 5 }}>
                          <KeyboardAvoidingView style={{ flex: 0.8 }} behavior="padding" enabled>
                            <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                              <Text p color={argonTheme.COLORS.WHITE}>
                                {t('userPassword')}
                              </Text>
                              <Input
                                rounded
                                password
                                borderless={errors?.userPassword ? false : true}
                                value={values?.userPassword}
                                // placeholder={!errors.userPassword ? '' : t(errors.userPassword)}
                                onChangeText={handleChange('userPassword')}
                                onBlur={handleBlur('userPassword')}
                                iconContent={
                                  <Icon
                                    size={16}
                                    color={argonTheme.COLORS.ICON}
                                    name="key"
                                    family="IconCollection"
                                    style={styles.inputIcons}
                                  />
                                }
                                error={errors?.userPassword ? true : false}
                                help={errors?.userPassword ? t(errors.userPassword) : ''}
                                bottomHelp
                              />
                            </Block>

                            <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                              <Text p color={argonTheme.COLORS.WHITE}>
                                {t('newPassword')}
                              </Text>
                              <Input
                                rounded
                                password
                                borderless={errors?.newPassword ? false : true}
                                name="newPassword"
                                value={values?.newPassword}
                                onChangeText={handleChange('newPassword')}
                                onBlur={handleBlur('newPassword')}
                                // placeholder={!errors?.newPassword ? '' : t(errors.newPassword)}
                                iconContent={
                                  <Icon
                                    size={16}
                                    color={argonTheme.COLORS.ICON}
                                    name="finger-print-outline"
                                    family="Ionicon"
                                    style={styles.inputIcons}
                                  />
                                }
                                error={errors?.newPassword ? true : false}
                                help={errors?.newPassword ? t(errors.newPassword) : ''}
                                bottomHelp
                              />
                            </Block>

                            <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                              <Text p color={argonTheme.COLORS.WHITE}>
                                {t('confirmPassword')}
                              </Text>
                              <Input
                                rounded
                                password
                                borderless={errors?.confirmPassword ? false : true}
                                name="confirmPassword"
                                value={values?.confirmPassword}
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                // placeholder={!errors?.confirmPassword ? '' : t(errors.confirmPassword)}
                                iconContent={
                                  <Icon
                                    size={16}
                                    color={argonTheme.COLORS.ICON}
                                    name="checkmark-done-outline"
                                    family="Ionicon"
                                    style={styles.inputIcons}
                                  />
                                }
                                error={errors?.confirmPassword ? true : false}
                                help={errors?.confirmPassword ? t(errors.confirmPassword) : ''}
                                bottomHelp
                              />
                            </Block>

                            <Block middle>
                              <Button color="primary" style={styles.saveButton} onPress={handleSubmit}>
                                <Block row middle center>
                                  <Icon
                                    name="save-outline"
                                    family="Ionicon"
                                    size={20}
                                    color={argonTheme.COLORS.SECONDARY}
                                    style={{ marginRight: 5 }}
                                  />
                                  <Text bold size={20} color={argonTheme.COLORS.WHITE}>
                                    {t('save')}
                                  </Text>
                                </Block>
                              </Button>
                            </Block>
                          </KeyboardAvoidingView>
                        </Block>
                      );
                    }}
                  </Formik>
                </Block>
              </Block>
            </Block>
          </ScrollView>
        </ImageBackground>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1,
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    // zIndex: 1,
  },
  profileBackground: {
    width: width,
    height: height * 0.6,
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.BLACK,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },

  avatarContainer: {
    position: 'relative',
    marginTop: -80,
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0,
  },
  nameInfo: {
    marginTop: 35,
  },
  divider: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },

  inputIcons: {
    marginRight: 12,
  },

  saveButton: {
    width: width * 0.5,
    // marginTop: 15,
  },
});

export default ChangePasswordScreen;
