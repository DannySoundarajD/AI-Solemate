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

          {/* Quick Actions Card */}
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
                    <Ionicons name="flash" size={16} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.cardTitle}>Quick Actions</Text>
                </View>
                <View style={styles.quickActions}>
                  {[
                    { icon: 'volume-high', text: 'Voice Guide', action: 'voice', colors: ['#10B981', '#059669'] },
                    { icon: 'eye', text: 'Detect Objects', action: 'detection', colors: ['#8B5CF6', '#7C3AED'] },
                    { icon: 'location-sharp', text: 'My Location', action: 'location', colors: ['#F59E0B', '#D97706'] }
                  ].map((item, index) => (
                    <Animated.View 
                      key={index}
                      style={[{ transform: [{ scale: quickActionScales[index] }] }]}
                    >
                      <TouchableOpacity 
                        style={styles.quickActionButton}
                        onPress={() => quickAction(item.action)}
                        activeOpacity={0.8}
                        {...createHoverAnimation(quickActionScales[index], 1.1)}
                      >
                        <LinearGradient
                          colors={item.colors}
                          style={styles.quickActionIcon}
                        >
                          <Ionicons name={item.icon} size={24} color="#FFFFFF" />
                        </LinearGradient>
                        <Text style={styles.quickActionText}>{item.text}</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                </View>
              </View>
            </BlurView>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  floatingElement: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
  },
  element1: {
    width: 150,
    height: 150,
    top: -75,
    right: -75,
  },
  element2: {
    width: 120,
    height: 120,
    bottom: 80,
    left: -60,
  },
  element3: {
    width: 80,
    height: 80,
    top: '40%',
    right: -40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: 15,
  },
  header: {
    marginHorizontal: 20,
    marginTop: 50,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headerGradient: {
    padding: 25,
    borderRadius: 16,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIconContainer: {
    marginRight: 12,
  },
  logoGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitleText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginRight: 8,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  batteryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  welcomeSection: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  cardContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  blurContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 16,
  },
  connectionCard: {
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  connectionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  connectionText: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  connectButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  connectButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconGradient: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#667eea',
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    borderRadius: 12,
    marginBottom: 16,
    paddingRight: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    height: 48,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIconGradient: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  navigationButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  navigationButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  navigationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  directionsContainer: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  directionsGradient: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  directionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667eea',
    marginBottom: 12,
  },
  directionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  directionNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  directionNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  directionText: {
    flex: 1,
    fontSize: 14,
    color: '#667eea',
    lineHeight: 20,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#667eea',
    textAlign: 'center',
  },
});