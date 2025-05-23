// navigation/AppNavigator.js
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { auth } from '../config/firebase'; 

import HomeScreen from '../screens/HomeScreen';
import BluetoothScreen from '../screens/BluetoothScreen';
import ObjectDetectionScreen from '../screens/ObjectDetectionScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import LoadingScreen from '../screens/LoadingScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main app tabs for authenticated users
function MainTabs() {
  return (
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
  );
}

// Authentication stack for unauthenticated users
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    console.log('AppNavigator: Setting up auth state listener');
    
    let unsubscribe;
    
    try {
      unsubscribe = onAuthStateChanged(
        auth, 
        (user) => {
          console.log('🔄 AppNavigator: Auth state changed');
          console.log('📊 User exists:', !!user);
          console.log('📊 Previous user state:', !!user);
          console.log('📊 Timestamp:', new Date().toISOString());
          
          if (user) {
            console.log('✅ User is authenticated:');
            console.log('   - UID:', user.uid);
            console.log('   - Email:', user.email);
            console.log('   - Display Name:', user.displayName);
            console.log('   - Email Verified:', user.emailVerified);
          } else {
            console.log('🚪 User signed out or not authenticated');
            console.log('🔄 Setting user state to null');
            console.log('🔄 Should trigger navigation to login screen');
          }
          
          setUser(user);
          setIsLoading(false);
          setAuthError(null); // Clear any previous errors
          
          // Additional debug after state update
          console.log('🔄 AppNavigator state updated');
          console.log('   - isLoading will be:', false);
          console.log('   - user will be:', !!user);
        },
        (error) => {
          console.error('AppNavigator: Auth state change error:', error);
          setAuthError(error);
          setIsLoading(false);
          
          // Show error alert but don't block the UI
          Alert.alert(
            'Authentication Error', 
            'There was a problem with authentication. Please try again or restart the app.',
            [
              { 
                text: 'OK', 
                onPress: () => {
                  // Reset error state and try to continue
                  setAuthError(null);
                  setUser(null); // Ensure we show login screen
                }
              }
            ]
          );
        }
      );
    } catch (error) {
      console.error('AppNavigator: Firebase Auth initialization error:', error);
      setAuthError(error);
      setIsLoading(false);
      
      Alert.alert(
        'Firebase Error', 
        'Please check your Firebase configuration and internet connection.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              setAuthError(null);
              setUser(null);
            }
          }
        ]
      );
    }

    return () => {
      console.log('AppNavigator: Cleaning up auth listener');
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  console.log('🔄 AppNavigator: Rendering with state:', { 
    isLoading, 
    hasUser: !!user,
    userEmail: user?.email,
    hasError: !!authError,
    timestamp: new Date().toISOString()
  });

  // Show loading screen while checking authentication
  if (isLoading) {
    console.log('AppNavigator: Showing loading screen');
    return (
      <NavigationContainer>
        <LoadingScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {user && !authError ? (
        <>
          {console.log('AppNavigator: Showing MainTabs for authenticated user')}
          <MainTabs />
        </>
      ) : (
        <>
          {console.log('AppNavigator: Showing AuthStack for unauthenticated user or error state')}
          <AuthStack />
        </>
      )}
    </NavigationContainer>
  );
}