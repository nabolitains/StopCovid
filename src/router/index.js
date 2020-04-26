import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import { AuthContext } from '../context/authentication';
import LoggedOutModule from './logged-out';
import LoggedInModule from './logged-in';
import { useContext, useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import auth from "@react-native-firebase/auth"
import ApiClient from "../api/ApiClient"

function AuthLoading({ navigation }) {
  const { init: checkLoggedInState } = useContext(AuthContext);
  useEffect(() => {
    auth().onAuthStateChanged( async(userRecord) =>{
      
      if(userRecord){ 
        
        const idToken = await auth().currentUser.getIdToken(true);
        await ApiClient.setToken(idToken)
        await ApiClient.setUid(userRecord.uid)
       // checkLoggedInState().then(isLoggedIn => {
       //   navigation.navigate(isLoggedIn ? 'LoggedIn' : 'LoggedOut');
       //   SplashScreen.hide();
       // });
      }else{ 
        await ApiClient.clearToken();
        await ApiClient.clearUid();
      }
      checkLoggedInState().then(isLoggedIn => {
        navigation.navigate(isLoggedIn ? 'LoggedIn' : 'LoggedOut');
        SplashScreen.hide();
      });
    }) 
  }, []);
  return null;
}

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading,
      LoggedOut: LoggedOutModule,
      LoggedIn: LoggedInModule,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
