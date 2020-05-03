import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import LanguageScreen from './screens/LanguageScreen';

const Stack = createStackNavigator();
const LoggedOut = () =>{
  return(
      <Stack.Navigator initialRouteName='Locale' headerMode='none'>
        <Stack.Screen name="Locale" component={LanguageScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
  )
}

export default LoggedOut;
