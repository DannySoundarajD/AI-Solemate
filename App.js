import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './screens/HomeScreen';
import BluetoothScreen from './screens/BluetoothScreen';
import ObjectDetectionScreen from './screens/ObjectDetectionScreen';
import EmergencyScreen from './screens/EmergencyScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#3B82F6',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#E5E7EB',
              height: 60,
              paddingBottom: 5,
              paddingTop: 5,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
            tabBarIcon: ({ color, size, focused }) => {
              let iconName;
              const iconSize = focused ? size + 2 : size;
              
              if (route.name === 'Navigate') iconName = 'navigate';
              else if (route.name === 'Device') iconName = 'bluetooth';
              else if (route.name === 'Detection') iconName = 'eye';
              else if (route.name === 'Emergency') iconName = 'alert-circle';
              else if (route.name === 'Settings') iconName = 'settings';

              return <Ionicons name={iconName} size={iconSize} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Navigate" component={HomeScreen} />
          <Tab.Screen name="Device" component={BluetoothScreen} />
          <Tab.Screen name="Detection" component={ObjectDetectionScreen} />
          <Tab.Screen name="Emergency" component={EmergencyScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}