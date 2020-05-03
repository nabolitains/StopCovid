import React from 'react'
import { NavigationContainer  } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/authentication';
import LoggedOutModule from './logged-out';
import LoggedInModule from './logged-in';
import { useContext, useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import auth from "@react-native-firebase/auth"
import ApiClient from "../api/ApiClient"
import AsyncStorage from '@react-native-community/async-storage';
import { UID,TOKEN } from '../constants/storage';

function AuthLoading({ navigation }) {
  const { init: checkLoggedInState } = useContext(AuthContext);
  useEffect(() => {
    auth().onAuthStateChanged( async(userRecord) =>{
      
      if(userRecord){ 
        AsyncStorage.setItem(UID, userRecord.uid)
        const idToken = await auth().currentUser.getIdToken(true);
        AsyncStorage.setItem(TOKEN, idToken)
        await ApiClient.setToken(idToken)
        await ApiClient.setUid(userRecord.uid)
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
const Stack = createStackNavigator();

export default Router = () =>{
  return(
    <NavigationContainer >
      <Stack.Navigator initialRouteName='AuthLoading'  headerMode='none'>
        <Stack.Screen name="Loading" component={AuthLoading} />
        <Stack.Screen name="LoggedOut" component={LoggedOutModule} />
        <Stack.Screen name="LoggedIn" component={LoggedInModule} />        
      </Stack.Navigator>
    </NavigationContainer>
  )
}
