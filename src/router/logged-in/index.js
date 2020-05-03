import React from 'react';
import Aid from "./screens/Aid"
import HomeScreen from './screens/HomeScreen';
import RequestDataScreen from './screens/RequestDataScreen';
import UserProvider from '../../context/user';
//import ClientScreen from '../Client';
import MapsScreen from './screens/MapsView'
import PasseScreen from './screens/PasseScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AllowLocationScreen from './screens/AllowLocationScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createMaterialBottomTabNavigator();

const LoggedInStackTabs = () =>{
  return (
      <Tab.Navigator
        initialRouteName='Accueil' 
        headerMode="none" 
        activeColor="#49c3ca"
        inactiveColor="#3e2465"
        barStyle={{ backgroundColor: '#ffff' }}
      >      
        <Tab.Screen options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="home" color="#49c3ca" size={26} />
          ),
        }} name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Aidez-moi"  options={{
          tabBarLabel: 'Aidez-moi',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="help-circle" color="#49c3ca" size={26} />
          ),
        }} component={Aid} />
        <Tab.Screen name="Maps" options={{
          tabBarLabel: 'Maps',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="google-maps" color="#49c3ca" size={26} />
          ),
        }} component={MapsScreen} />
        <Tab.Screen name="Mon Pass" options={{
          tabBarLabel: 'Mon Pass',
          tabBarIcon: () => (
            <FontAwesome name="universal-access" color="#49c3ca" size={26} />
          ),
        }}   component={PasseScreen} />
      </Tab.Navigator>
  );
}

const LoggedInStack = createStackNavigator();
const LoggedIn = () => {
  return (
    <LoggedInStack.Navigator initialRouteName='Permission' headerMode='none'>
      <LoggedInStack.Screen name="LoggedInStackTabs" component={LoggedInStackTabs} />
      <LoggedInStack.Screen name="Permission" component={AllowLocationScreen} />
      <LoggedInStack.Screen name="Envoyer" component={RequestDataScreen} />
    </LoggedInStack.Navigator>   
  );
}

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
