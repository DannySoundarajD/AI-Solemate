// navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import BluetoothScreen from '../screens/BluetoothScreen';
import ObjectDetectionScreen from '../screens/ObjectDetectionScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Bluetooth" component={BluetoothScreen} />
        <Tab.Screen name="Detect" component={ObjectDetectionScreen} />
        <Tab.Screen name="Emergency" component={EmergencyScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
