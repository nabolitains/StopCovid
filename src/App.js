import React, { Suspense, useState, useEffect } from 'react';
import { Platform, StatusBar, YellowBox} from 'react-native';
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import styled from 'styled-components/native';

import Router from './router';
import AuthProvider from './context/authentication';
import { AlertProvider } from './context/alert';
import LoadingScreen from './components/LoadingScreen';
import initI18n from './i18n';
import fixTextCutoff from './utils/fix-text-cutoff';
import { initFirebaseConnection } from './push-notifications';
import Colors from './constants/Colors';

initI18n();
fixTextCutoff();
// ignore specific yellowbox warnings
YellowBox.ignoreWarnings(["Require cycle:", "Remote debugger"]);

const Root = styled.View`
  background-color: ${Colors.background};
  flex: 1;
`;

const App = () => {
  const [loading, setLoading] = useState(true);
  
  async function preload() {
    try {
      await Promise.all([
        // Initialize firebase for push notifications.
        Constants.isDevice && initFirebaseConnection(),

        // Load theme fonts
        Font.loadAsync({
          OpenSans: require('./assets/fonts/OpenSans-Regular.ttf'),
          OpenSansSemiBold: require('./assets/fonts/OpenSans-SemiBold.ttf'),
          OpenSansBold: require('./assets/fonts/OpenSans-Bold.ttf'),
          OpenSansExtraBold: require('./assets/fonts/OpenSans-ExtraBold.ttf'),
        }),
      ]);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    preload();
  }, []);

  if (loading) {
    return <Root />;
  }

  return (  
    <Root>
      <Suspense fallback={<LoadingScreen />}>
        <Router />
      </Suspense>
    </Root>
  );
};

export default () => (
  <>
    {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
    <AlertProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AlertProvider>
  </>
);
