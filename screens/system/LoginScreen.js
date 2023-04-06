import { Block, Checkbox, Text } from 'galio-framework';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
// import AwesomeAlert from 'react-native-awesome-alerts';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Application from 'expo-application';
import { name as app_name, version as app_version } from '../../package.json';

import { Formik } from 'formik';
import _ from 'lodash';
import Spinner from 'react-native-loading-spinner-overlay';
import * as yup from 'yup';

import { Button, Icon, Input } from '@components';
import { argonTheme, Images } from '@constants';
import { AuthContext } from '@context';
import { LoginDto } from '@models';
import { loginService } from '@services/system';
import languageStore from '@stores/system/languageStore';
import userStore from '@stores/system/userStore';
import connectionStore from '@stores/system/connectionStore';

const { width, height } = Dimensions.get('screen');

const Logo = require('@assets/imgs/soluM_Logo-removebg-preview.png');

// const companyList = {
//   autonsi: {
//     companyName: 'Autonsi',
//     baseUrl: 'http://s-wms.autonsi.com:92/api',
//     rootUrl: 'http://s-wms.autonsi.com:92',
//   },
//   solum: {
//     companyName: 'SoluM',
//     baseUrl: 'http://baseapi.autonsi.com/api',
//     rootUrl: 'http://baseapi.autonsi.com',
//   },
// };

const LoginScreen = () => {
  const { t, i18n } = useTranslation();

  ////context
  const { setSplashLoading } = useContext(AuthContext);

  ////languageStore
  const language = languageStore((state) => state.language);
  const dispatchChangeLanguage = languageStore((state) => state.dispatchChangeLanguage);

  ////user
  const dispatchSetCurrentUser = userStore((state) => state.dispatchSetCurrentUser);
  const kickOutState = userStore((state) => state.kickOutState);
  const dispatchSetKickOutState = userStore((state) => state.dispatchSetKickOutState);

  ////menu
  const dispatchSetCurrentUserMenus = userStore((state) => state.dispatchSetCurrentUserMenus);

  ////token
  const dispatchSetAccessToken = userStore((state) => state.dispatchSetAccessToken);
  const dispatchSetRefreshToken = userStore((state) => state.dispatchSetRefreshToken);

  ////connectionStore
  const apiConnection = connectionStore((state) => state.apiConnection);
  const dispatchSetApiConnection = connectionStore((state) => state.dispatchSetApiConnection);

  const [spinnerLoading, setSpinnerLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [companyModalVisible, setCompanyModalVisible] = useState(false);
  // const [showAlert, setShowAlert] = useState(false);

  ////useState
  const [hasCameraPermission, setCameraPermission] = useState(null);

  const getBarCodeScannerPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    // setHasPermission(status === 'granted');
  };

  const loginSchema = yup.object().shape({
    userName: yup.string().nullable().required('userName_required'),
    userPassword: yup.string().nullable().required('userPassword_required'),
  });

  const companySchema = yup.object().shape({
    companyName: yup.string().nullable().required('companyName_required'),
    rootUrl: yup.string().nullable().required('rootUrl_required'),
  });

  const handleLogin = async (params) => {
    setSpinnerLoading(true);
    const { HttpResponseCode, ResponseMessage, Data } = await loginService.handleLogin(params);

    if (HttpResponseCode === 200 && ResponseMessage === 'general.success') {
      await Promise.all([dispatchSetAccessToken(Data.accessToken), dispatchSetRefreshToken(Data.refreshToken)]);

      try {
        // const user = await loginService.getUserInfo();

        const { HttpResponseCode, ResponseMessage, Data } = await loginService.getUserInfo();

        if (HttpResponseCode === 200 && ResponseMessage === 'general.success') {
          const userInfo = {
            userId: Data.userId,
            userName: Data.userName,
            RoleNameList: Data.RoleNameList,
            lastLoginOnApp: Data.lastLoginOnApp,
          };
          const fullMenuArr = Data.Menus;
          const acceptedMenuArr = fullMenuArr.filter((o) => !_.isEmpty(o.menuComponent) && o.forApp);

          dispatchSetCurrentUser(userInfo);
          dispatchSetCurrentUserMenus(acceptedMenuArr);

          setSpinnerLoading(false);
          setSplashLoading(false);
        } else {
          setSpinnerLoading(false);

          Alert.alert(t('alert_title_error'), t(user?.ResponseMessage || 'general.system_error'), [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]);
        }
      } catch (error) {
        setSpinnerLoading(false);
        Alert.alert(t('alert_title_error'), t('general.system_error'), [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
      }
    } else {
      setSpinnerLoading(false);
      Alert.alert(t('alert_title_error'), t(ResponseMessage), [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
      // throw new Error(ResponseMessage || 'general.system_error');
    }
  };

  useEffect(() => {
    i18n.changeLanguage(language);

    // getBarCodeScannerPermissions();

    return () => {};
  }, [language]);

  return (
    <Block flex middle>
      {/* <StatusBar hidden /> */}
      <ImageBackground source={Images.RegisterBackground} style={{ width, height, zIndex: 1 }}>
        <Spinner visible={spinnerLoading} />
        <Block safe flex middle>
          <Block style={styles.loginContainer}>
            {/* TITLE */}
            <Block flex={0.3} middle style={styles.loginTitle}>
              <Text color={argonTheme.COLORS.LABEL} size={40}>
                {/* {t('welcome')} */}
                Wellcome to LHKIOT
              </Text>
              {/* <Image source={Logo} /> */}
            </Block>

            {/* LOGIN FORM */}

            <KeyboardAvoidingView style={{ flex: 0.55 }} behavior="padding" enabled>
              <Formik
                validationSchema={loginSchema}
                initialValues={{ ...LoginDto }}
                enableReinitialize
                onSubmit={(values) => {
                  handleLogin(values);
                }}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => {
                  /* console.log('errors: ', errors); */
                  return (
                    <Block middle style={{ marginTop: 5 }}>
                      <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                        <Input
                          borderless={errors?.userName ? false : true}
                          value={values?.userName}
                          placeholder={!touched.userName || !errors.userName ? t('userName') : t(errors.userName)}
                          onChangeText={handleChange('userName')}
                          onBlur={handleBlur('userName')}
                          iconContent={
                            <Icon
                              size={16}
                              color={argonTheme.COLORS.ICON}
                              name="user"
                              family="IconCollection"
                              style={styles.inputIcons}
                            />
                          }
                          error={touched.userName && errors.userName ? true : false}
                        />
                        {/* {errors.userName && touched.userName && (
                        <Text bold size={14} color={argonTheme.COLORS.ERROR}>
                          {t(errors.userName)}
                        </Text>
                      )} */}
                      </Block>

                      <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                        <Input
                          // rounded
                          password
                          borderless={errors?.userPassword ? false : true}
                          name="userPassword"
                          value={values?.userPassword}
                          onChangeText={handleChange('userPassword')}
                          onBlur={handleBlur('userPassword')}
                          placeholder={
                            !touched.userPassword || !errors?.userPassword ? t('userPassword') : t(errors.userPassword)
                          }
                          error={touched.userPassword && errors?.userPassword ? true : false}
                          iconContent={
                            <Icon
                              size={16}
                              color={argonTheme.COLORS.ICON}
                              name="key"
                              family="IconCollection"
                              style={styles.inputIcons}
                            />
                          }
                        />
                      </Block>

                      <Block center right width={width * 0.8}>
                        {/* <Checkbox
                          flexDirection="row-reverse"
                          checkboxStyle={{
                            borderWidth: 3,
                          }}
                          color={argonTheme.COLORS.PRIMARY}
                          label={language === 'EN' ? 'English' : 'Tiếng Việt'}
                          onChange={() => {
                            language === 'EN' ? dispatchChangeLanguage('VI') : dispatchChangeLanguage('EN');
                          }}
                        /> */}
                        <TouchableOpacity
                          onPress={() => {
                            language === 'EN' ? dispatchChangeLanguage('VI') : dispatchChangeLanguage('EN');
                          }}
                        >
                          <Text bold color={argonTheme.COLORS.ERROR}>
                            {language === 'EN' ? 'English' : 'Tiếng Việt'}
                          </Text>
                        </TouchableOpacity>
                      </Block>

                      <Block middle>
                        <Button color="primary" style={styles.signInButton} onPress={handleSubmit}>
                          <Block row middle center>
                            <Text bold size={20} color={argonTheme.COLORS.WHITE}>
                              {t('sign_in')}
                            </Text>
                            <Icon name="log-in" family="Ionicon" size={30} color={argonTheme.COLORS.SECONDARY} />
                          </Block>
                        </Button>
                      </Block>
                    </Block>
                  );
                }}
              </Formik>

              <Block middle style={{ marginTop: 5 }}>
                <Block width={width * 0.8} middle row space="between">
                  <Text bold color={argonTheme.COLORS.BLACK}>
                    {/* {Application.nativeBuildVersion} */}
                    {/* {Application.nativeApplicationVersion} */}
                    {`${t('version')}: ${app_version}`}
                  </Text>
                  <TouchableOpacity
                    // onPress={() => {
                    //   if (_.isEqual(apiConnection, companyList.autonsi)) {
                    //     dispatchSetApiConnection(companyList.solum);
                    //   } else {
                    //     dispatchSetApiConnection(companyList.autonsi);
                    //   }
                    // }}
                    onPress={() => {
                      setCompanyModalVisible(!companyModalVisible);
                    }}
                  >
                    <Text bold color={argonTheme.COLORS.BLACK}>
                      {`${t('company')}: ${apiConnection.companyName}`}
                    </Text>
                  </TouchableOpacity>
                </Block>
              </Block>
            </KeyboardAvoidingView>

            <Modal
              isVisible={companyModalVisible}
              avoidKeyboard={true}
              hasBackdrop={true}
              onRequestClose={() => {
                setCompanyModalVisible(!companyModalVisible);
              }}
            >
              <Block safe flex middle>
                <Block middle style={styles.companyContainer}>
                  <Block flex={0.2} middle>
                    <Text color={argonTheme.COLORS.LABEL} size={30}>
                      {t('company')}
                    </Text>
                  </Block>

                  <KeyboardAvoidingView style={{ flex: 0.55 }} behavior="padding" enabled>
                    <Formik
                      validationSchema={companySchema}
                      initialValues={{ ...apiConnection }}
                      enableReinitialize
                      onSubmit={(values) => {
                        const companyInfo = { ...values, baseUrl: values.rootUrl + '/api' };
                        dispatchSetApiConnection(companyInfo);
                        setCompanyModalVisible(!companyModalVisible);
                      }}
                    >
                      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => {
                        return (
                          <Block flex={1} middle style={{ marginTop: 5 }}>
                            <Block width={width * 0.7} style={{ marginBottom: 5 }}>
                              <Input
                                borderless={errors?.companyName ? false : true}
                                value={values?.companyName}
                                placeholder={
                                  !touched.companyName || !errors.companyName ? t('companyName') : t(errors.companyName)
                                }
                                onChangeText={handleChange('companyName')}
                                onBlur={handleBlur('companyName')}
                                iconContent={
                                  <Icon
                                    size={16}
                                    color={argonTheme.COLORS.ICON}
                                    name="office"
                                    family="IconCollection"
                                    style={styles.inputIcons}
                                  />
                                }
                                error={touched.companyName && errors.companyName ? true : false}
                              />
                            </Block>

                            <Block width={width * 0.7} style={{ marginBottom: 5 }}>
                              <Input
                                borderless={errors?.rootUrl ? false : true}
                                name="rootUrl"
                                value={values?.rootUrl}
                                onChangeText={handleChange('rootUrl')}
                                onBlur={handleBlur('rootUrl')}
                                placeholder={!touched.rootUrl || !errors?.rootUrl ? t('rootUrl') : t(errors.rootUrl)}
                                error={touched.rootUrl && errors?.rootUrl ? true : false}
                                iconContent={
                                  <Icon
                                    size={16}
                                    color={argonTheme.COLORS.ICON}
                                    name="link"
                                    family="IconCollection"
                                    style={styles.inputIcons}
                                  />
                                }
                              />
                            </Block>

                            <Block middle>
                              <Button color="primary" style={styles.saveButton} onPress={handleSubmit}>
                                <Block row middle center>
                                  <Text bold size={17} color={argonTheme.COLORS.WHITE}>
                                    {t('save')}
                                  </Text>
                                </Block>
                              </Button>
                            </Block>
                          </Block>
                        );
                      }}
                    </Formik>
                  </KeyboardAvoidingView>

                  <Button
                    onlyIcon
                    icon="close"
                    iconFamily="Ionicon"
                    iconSize={30}
                    color="#FF0000"
                    iconColor="#FF0000"
                    style={styles.closeButton}
                    onPress={() => {
                      setCompanyModalVisible(!companyModalVisible);
                    }}
                  >
                    warning
                  </Button>
                </Block>
              </Block>
            </Modal>

            <Modal
              isVisible={kickOutState}
              avoidKeyboard={true}
              hasBackdrop={true}
              onRequestClose={() => {
                dispatchSetKickOutState(false);
              }}
            >
              <Block safe flex middle>
                <Block middle style={styles.messageContainer}>
                  <Text color={argonTheme.COLORS.LABEL} size={20}>
                    {t('account_is_logged_in_some_where')}
                  </Text>

                  <Button
                    onlyIcon
                    icon="close"
                    iconFamily="Ionicon"
                    iconSize={30}
                    color="#FF0000"
                    iconColor="#FF0000"
                    style={styles.closeButton}
                    onPress={() => {
                      dispatchSetKickOutState(false);
                    }}
                  ></Button>
                </Block>
              </Block>
            </Modal>
          </Block>
        </Block>

        {/* <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="AwesomeAlert"
          message="I have a message for you!"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="OK"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            setShowAlert(false);
          }}
          onConfirmPressed={() => {
            setShowAlert(false);
          }}
        /> */}
      </ImageBackground>
    </Block>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    width: width * 0.9,
    height: height * 0.5,
    backgroundColor: '#F4F5F7',
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'hidden',
  },
  loginTitle: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#8898AA',
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: '#fff',
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: '800',
    fontSize: 14,
  },
  inputIcons: {
    marginRight: 12,
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30,
  },
  signInButton: {
    width: width * 0.5,
    marginTop: 25,
  },
  modal: {
    backgroundColor: argonTheme.COLORS.WHITE,
  },
  companyContainer: {
    width: width * 0.8,
    height: height * 0.4,
    backgroundColor: '#F7F7F7',
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'hidden',
  },
  saveButton: {
    width: width * 0.3,
    marginTop: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
  },

  messageContainer: {
    width: width * 0.8,
    height: height * 0.2,
    backgroundColor: '#F7F7F7',
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'hidden',
  },
});

export default LoginScreen;
