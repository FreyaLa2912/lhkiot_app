import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
// import AppLoading from 'expo-app-loading';
import { useFonts } from '@use-expo/font';
import { Asset } from 'expo-asset';
import { Block, GalioProvider } from 'galio-framework';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['EventEmitter.removeListener']);

// Before rendering any navigation stack
import { enableScreens } from 'react-native-screens';

enableScreens();

import LandingStack from '@navigation/LandingStack';
import { Images, articles, argonTheme } from '@constants';

import { AuthProvider } from '@context';

// cache app images
const assetImages = [
  Images.Onboarding,
  Images.LogoOnboarding,
  Images.Logo,
  Images.Pro,
  Images.ArgonLogo,
  Images.iOSLogo,
  Images.androidLogo,
];

// cache product images
articles.map((article) => assetImages.push(article.image));

const cacheImages = (images) => {
  return images.map((image) => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};

export default (props) => {
  const [loading, setLoading] = useState(false);
  let [fontsLoaded] = useFonts({
    // ArgonExtra: require('@assets/font/argon.ttf'),
    IconCollection: require('@assets/font/icomoon.ttf'),
  });

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load assets, fonts, and data
        await Promise.all([...cacheImages(assetImages), fontsLoaded]);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!loading) {
    return null;
  } else {
    return (
      <NavigationContainer>
        <GalioProvider theme={argonTheme}>
          <Block flex>
            <AuthProvider>
              <LandingStack />
              <Toast />
            </AuthProvider>
          </Block>
        </GalioProvider>
      </NavigationContainer>
    );
  }
};

// export default (props) => {
//   const [isLoadingComplete, setLoading] = useState(false);
//   let [fontsLoaded] = useFonts({
//     ArgonExtra: require('@assets/font/argon.ttf'),
//   });

//   const _loadResourcesAsync = () => {
//     return Promise.all([...cacheImages(assetImages)]);
//   };

//   const _handleLoadingError = (error) => {
//     // In this case, you might want to report the error to your error
//     // reporting service, for example Sentry
//     console.warn(error);
//   };

//   const _handleFinishLoading = () => {
//     setLoading(true);
//   };

//   if (!fontsLoaded && !isLoadingComplete) {
//     return (
//       <AppLoading startAsync={_loadResourcesAsync} onError={_handleLoadingError} onFinish={_handleFinishLoading} />
//     );
//   } else if (fontsLoaded) {
//     return (
//       <NavigationContainer>
//         <GalioProvider theme={argonTheme}>
//           <Block flex>
//             <Screens />
//           </Block>
//         </GalioProvider>
//       </NavigationContainer>
//     );
//   } else {
//     return null;
//   }
// };

// export default class App extends React.Component {
//   state = {
//     isLoadingComplete: false
//   };

//   render() {
//     if (!this.state.isLoadingComplete) {
//       return (
//         <AppLoading
//           startAsync={this._loadResourcesAsync}
//           onError={this._handleLoadingError}
//           onFinish={this._handleFinishLoading}
//         />
//       );
//     } else {
//       return (
//         <NavigationContainer>
//           <GalioProvider theme={argonTheme}>
//             <Block flex>
//               <Screens />
//             </Block>
//           </GalioProvider>
//         </NavigationContainer>
//       );
//     }
//   }

//   _loadResourcesAsync = async () => {
//     return Promise.all([...cacheImages(assetImages)]);
//   };

//   _handleLoadingError = error => {
//     // In this case, you might want to report the error to your error
//     // reporting service, for example Sentry
//     console.warn(error);
//   };

//   _handleFinishLoading = () => {
//     this.setState({ isLoadingComplete: true });
//   };
// }
