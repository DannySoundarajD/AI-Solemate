import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import styles from "../styles/HomeStyles"

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [currentLocation, setCurrentLocation] = useState('Searching for location...');
  const [destination, setDestination] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const [directions, setDirections] = useState([]);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const statusPulseAnim = useRef(new Animated.Value(1)).current;
  
  // Button animation values
  const connectButtonScale = useRef(new Animated.Value(1)).current;
  const navButtonScale = useRef(new Animated.Value(1)).current;
  const quickActionScales = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1)
  ]).current;

  // Input focus animation
  const inputFocusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    // Logo rotation animation
    Animated.loop(
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation for status indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(statusPulseAnim, {
          toValue: 1.2,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(statusPulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulate real-time location updates
    const locationInterval = setInterval(() => {
      setCurrentLocation('123 Main Street, Downtown');
    }, 5000);

    // Simulate battery level updates
    const batteryInterval = setInterval(() => {
      setBatteryLevel(prev => Math.max(prev - 1, 0));
    }, 30000);

    return () => {
      clearInterval(locationInterval);
      clearInterval(batteryInterval);
    };
  }, []);

  // Animation helper functions
  const createHoverAnimation = (animValue, toValue = 1.05) => ({
    onPressIn: () => {
      Animated.spring(animValue, {
        toValue,
        useNativeDriver: true,
        tension: 300,
        friction: 4,
      }).start();
    },
    onPressOut: () => {
      Animated.spring(animValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 4,
      }).start();
    },
  });

  const createInputFocusAnimation = () => ({
    onFocus: () => {
      Animated.timing(inputFocusAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    },
    onBlur: () => {
      Animated.timing(inputFocusAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    },
  });

  const startNavigation = () => {
    if (!destination.trim()) {
      Alert.alert('Error', 'Please enter a destination');
      return;
    }

    if (!isConnected) {
      Alert.alert('Device Not Connected', 'Please connect your SoleMate device first');
      return;
    }

    setIsNavigating(true);
    setDirections([
      'Head north on Main Street for 100 meters',
      'Turn right onto Oak Avenue',
      'Continue straight for 200 meters',
      'Your destination will be on the left'
    ]);

    Alert.alert('Navigation Started', 'Voice guidance is now active');
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setDirections([]);
    Alert.alert('Navigation Stopped', 'You have arrived at your destination');
  };

  const quickAction = (action) => {
    switch (action) {
      case 'voice':
        Alert.alert('Voice Guide', 'Voice guidance activated');
        break;
      case 'detection':
        Alert.alert('Object Detection', 'Starting object detection...');
        break;
      case 'location':
        Alert.alert('Current Location', currentLocation);
        break;
    }
  };

  const logoRotate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const inputBorderColor = inputFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(102, 126, 234, 0.3)', 'rgba(102, 126, 234, 0.8)'],
  });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Animated Background Elements */}
        <View style={styles.backgroundElements}>
          <Animated.View style={[styles.floatingElement, styles.element1, {
            transform: [{ rotate: logoRotate }]
          }]} />
          <Animated.View style={[styles.floatingElement, styles.element2, {
            transform: [{ rotate: logoRotate }]
          }]} />
          <Animated.View style={[styles.floatingElement, styles.element3, {
            transform: [{ rotate: logoRotate }]
          }]} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.headerGradient}
            >
              <View style={styles.statusBar}>
                <View style={styles.appTitle}>
                  <Animated.View style={[
                    styles.logoIconContainer,
                    { transform: [{ rotate: logoRotate }] }
                  ]}>
                    <LinearGradient
                      colors={['#FF6B6B', '#4ECDC4']}
                      style={styles.logoGradient}
                    >
                      <Ionicons name="walk" size={24} color="#fff" />
                    </LinearGradient>
                  </Animated.View>
                  <View style={styles.titleContainer}>
                    <Text style={styles.appTitleText}>SoleMate</Text>
                    <Animated.View style={[
                      styles.statusDot, 
                      { 
                        backgroundColor: isConnected ? '#10B981' : '#EF4444',
                        transform: [{ scale: statusPulseAnim }]
                      }
                    ]} />
                  </View>
                </View>
                
                <View style={styles.statusInfo}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                    style={styles.batteryContainer}
                  >
                    <Ionicons name="battery-half" size={16} color="#FFFFFF" />
                    <Text style={styles.batteryText}>{batteryLevel}%</Text>
                  </LinearGradient>
                </View>
              </View>

              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>Welcome Back</Text>
                <Text style={styles.welcomeSubtitle}>Ready for your next journey?</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Connection Status Card */}
          <Animated.View style={[
            styles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            <BlurView intensity={80} style={styles.blurContainer}>
              <View style={[styles.card, styles.connectionCard, {
                backgroundColor: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderColor: isConnected ? '#10B981' : '#EF4444'
              }]}>
                <View style={styles.connectionStatus}>
                  <Animated.View style={[
                    styles.connectionDot, 
                    { 
                      backgroundColor: isConnected ? '#10B981' : '#EF4444',
                      transform: [{ scale: statusPulseAnim }]
                    }
                  ]} />
                  <Text style={[styles.connectionText, { color: isConnected ? '#065F46' : '#991B1B' }]}>
                    {isConnected ? 'SoleMate Device Connected' : 'Device Not Connected'}
                  </Text>
                </View>
                {!isConnected && (
                  <Animated.View style={[{ transform: [{ scale: connectButtonScale }] }]}>
                    <TouchableOpacity 
                      style={styles.connectButton}
                      onPress={() => setIsConnected(true)}
                      activeOpacity={0.8}
                      {...createHoverAnimation(connectButtonScale)}
                    >
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.connectButtonGradient}
                      >
                        <Text style={styles.connectButtonText}>Connect</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </View>
            </BlurView>
          </Animated.View>

          {/* Location Card */}
          
          <Animated.View style={[
            styles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            <BlurView intensity={80} style={styles.blurContainer}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.iconGradient}
                  >
                    <Ionicons name="location" size={16} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.cardTitle}>Current Location</Text>
                </View>
                <Text style={styles.locationText}>{currentLocation}</Text>
              </View>
            </BlurView>
          </Animated.View>

          {/* Navigation Card */}
          <Animated.View style={[
            styles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            <BlurView intensity={80} style={styles.blurContainer}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.iconGradient}
                  >
                    <Ionicons name="navigate" size={16} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.cardTitle}>Navigation</Text>
                </View>
                
                <Animated.View style={[
                  styles.inputWrapper,
                  { borderColor: inputBorderColor }
                ]}>
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.inputIconGradient}
                  >
                    <Ionicons name="search" size={16} color="#fff" />
                  </LinearGradient>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Where would you like to go?"
                    value={destination}
                    onChangeText={setDestination}
                    placeholderTextColor="#999"
                    {...createInputFocusAnimation()}
                  />
                </Animated.View>
                
                <Animated.View style={[{ transform: [{ scale: navButtonScale }] }]}>
                  <TouchableOpacity
                    style={styles.navigationButton}
                    onPress={isNavigating ? stopNavigation : startNavigation}
                    disabled={!isConnected && !isNavigating}
                    activeOpacity={0.8}
                    {...createHoverAnimation(navButtonScale)}
                  >
                    <LinearGradient
                      colors={isConnected || isNavigating ? ['#667eea', '#764ba2'] : ['#ccc', '#ccc']}
                      style={styles.navigationButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Ionicons 
                        name={isNavigating ? 'stop' : 'navigate'} 
                        size={18} 
                        color="#FFFFFF" 
                      />
                      <Text style={styles.navigationButtonText}>
                        {isNavigating ? 'Stop Navigation' : 'Start Navigation'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>

                {/* Directions */}
                {isNavigating && directions.length > 0 && (
                  <View style={styles.directionsContainer}>
                    <LinearGradient
                      colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
                      style={styles.directionsGradient}
                    >
                      <Text style={styles.directionsTitle}>Current Directions</Text>
                      {directions.map((direction, index) => (
                        <View key={index} style={styles.directionItem}>
                          <LinearGradient
                            colors={['#667eea', '#764ba2']}
                            style={styles.directionNumber}
                          >
                            <Text style={styles.directionNumberText}>{index + 1}</Text>
                          </LinearGradient>
                          <Text style={styles.directionText}>{direction}</Text>
                        </View>
                      ))}
                    </LinearGradient>
                  </View>
                )}
              </View>
            </BlurView>
          </Animated.View>

          
        </ScrollView>
      </LinearGradient>
    </>
  );
}

