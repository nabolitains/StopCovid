import React from 'react';
import { createStackNavigator } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import AllowLocationScreen from './screens/AllowLocationScreen';
import RequestDataScreen from './screens/RequestDataScreen';
import UserProvider from '../../context/user';
//import ClientScreen from '../Client';
import MapsScreen from '../../components/MapsView';
import PasseScreen from './screens/PasseScreen';

const LoggedIn = createStackNavigator(
  {
    Permission: AllowLocationScreen,
    Home: { screen: HomeScreen },
    Maps: {screen: MapsScreen},
    Pass:{screen:PasseScreen},
    RequestData: RequestDataScreen,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);

const LoggedInNavigator = ({ navigation, ...props }) => {
  return (
    <UserProvider>
      <LoggedIn navigation={navigation} {...props} />
    </UserProvider>
  );
};

LoggedInNavigator.router = {
  ...LoggedIn.router,
};

export default LoggedInNavigator;
