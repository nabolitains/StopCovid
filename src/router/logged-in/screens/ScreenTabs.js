import React from 'react';
import Aid from "./Aid"
import HomeScreen from './HomeScreen';
import RequestDataScreen from './RequestDataScreen';
import MapsScreen from './MapsView'
import PasseScreen from './PasseScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const Tab = createMaterialBottomTabNavigator();

export const HomeDefault = () =>{
    return (
      <Tab.Navigator
      initialRouteName='home' 
      headerMode="none" 
      activeColor="#49c3ca"
      inactiveColor="#3e2465"
      barStyle={{ backgroundColor: '#ffff' }}
      >
        <Tab.Screen options={{
          tabBarLabel: 'Profile',
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
        <Tab.Screen name="Envoyer" options={{
          tabBarLabel: 'Envoyer',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="send" color="#49c3ca" size={26} />
          ),
        }}  component={RequestDataScreen} />
      </Tab.Navigator>
    )
  }