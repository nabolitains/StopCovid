 import React, { ReactPropTypes } from 'react';
import { createStackNavigator, NavigationScreenProp, NavigationContainer } from 'react-navigation'; 
import UserProvider from '../../context/user';
import Intro from './Screens/Intro';

const ClientScreens = createStackNavigator(
  {
    Intro: Intro
  },
  {
    initialRouteName: 'Intro',
    headerMode: 'none',
  },
);

export default ClientScreens;

