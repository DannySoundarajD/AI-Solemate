// navigation/AppNavigator.js
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { Alert, View, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
const { width } = Dimensions.get('window');

// Custom Tab Bar Component with Gradient and Animations
function CustomTabBar({ state, descriptors, navigation }) {
  const [animatedValues] = useState(
    state.routes.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    // Animate focused tab
    animatedValues.forEach((value, index) => {
      Animated.timing(value, {
        toValue: state.index === index ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [state.index]);

  const getIconName = (routeName) => {
    switch (routeName) {
      case 'Navigate': return 'navigate';
      case 'Device': return 'bluetooth';
      case 'Detection': return 'eye';
      case 'Emergency': return 'alert-circle';
      case 'Settings': return 'settings';
      default: return 'home';
    }
  };

  const getTabGradient = (routeName, isFocused) => {
    const gradients = {
      Navigate: isFocused ? ['rgba(102, 126, 234, 0.8)', 'rgba(118, 75, 162, 0.8)'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'],
      Device: isFocused ? ['rgba(79, 172, 254, 0.8)', 'rgba(0, 242, 254, 0.8)'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'],
      Detection: isFocused ? ['rgba(67, 233, 123, 0.8)', 'rgba(56, 249, 215, 0.8)'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'],
      Emergency: isFocused ? ['rgba(250, 112, 154, 0.8)', 'rgba(254, 225, 64, 0.8)'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'],
      Settings: isFocused ? ['rgba(168, 237, 234, 0.8)', 'rgba(254, 214, 227, 0.8)'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'],
    };
    return gradients[routeName] || gradients.Navigate;
  };

  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 65,
      paddingBottom: 5,
    }}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['rgba(16, 18, 27, 0.3)', 'rgba(16, 18, 27, 0.7)']}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      
      {/* Floating Elements */}
      <View style={{
        position: 'absolute',
        top: -20,
        left: -15,
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 20,
      }} />
      <View style={{
        position: 'absolute',
        top: -10,
        right: -20,
        width: 30,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.01)',
        borderRadius: 15,
      }} />

      {/* Tab Bar Content */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 15,
        paddingTop: 10,
        height: 60,
      }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

          const isFocused = state.index === index;
          const animatedValue = animatedValues[index];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Animated scale and opacity
          const scale = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.15],
          });

          const iconOpacity = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 1],
          });

          const labelOpacity = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1],
          });

          return (
            <Animated.View
              key={route.key}
              style={{
                alignItems: 'center',
                flex: 1,
                transform: [{ scale }],
              }}
            >
              {/* Tab Icon Container */}
              <TouchableOpacity 
                onPress={onPress}
                activeOpacity={0.7}
                style={{
                  width: 40,
                  height: 28,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 3,
                  overflow: 'hidden',
                  shadowColor: isFocused ? '#667eea' : 'transparent',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 6,
                  elevation: isFocused ? 4 : 0,
                }}
              >
                <LinearGradient
                  colors={getTabGradient(route.name, isFocused)}
                  style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 14,
                  }}
                >
                  <Animated.View
                    style={{
                      opacity: iconOpacity,
                    }}
                  >
                    <Ionicons
                      name={getIconName(route.name)}
                      size={isFocused ? 20 : 18}
                      color={isFocused ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'}
                    />
                  </Animated.View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Tab Label */}
              <Animated.Text
                onPress={onPress}
                style={{
                  opacity: labelOpacity,
                  color: isFocused ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                  fontSize: 9,
                  fontWeight: isFocused ? '700' : '500',
                  letterSpacing: 0.3,
                  textShadowColor: isFocused ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 1,
                }}
              >
                {label}
              </Animated.Text>

              {/* Active Indicator Dot */}
              {isFocused && (
                <Animated.View
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: 1.5,
                    backgroundColor: '#ffffff',
                    marginTop: 1,
                    opacity: animatedValue,
                    shadowColor: '#ffffff',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.4,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                />
              )}
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

// Main app tabs for authenticated users
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
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