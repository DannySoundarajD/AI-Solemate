import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import styles from "../styles/BluetoothStyles"

const { width, height } = Dimensions.get('window');

// Responsive sizing function
const isTabletOrDesktop = width >= 768;
const scale = (size) => {
  if (isTabletOrDesktop) {
    return size; 
  }
  return size;
};

export default function BluetoothScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [devices, setDevices] = useState([
    {
      id: 'solemate-001',
      name: 'SoleMate-001',
      address: '00:11:22:33:44:55',
      paired: false,
      signal: -45,
      battery: 85,
      status: 'Available',
      type: 'Smart Shoe',
    },
    {
      id: 'solemate-002',
      name: 'SoleMate-002',
      address: '00:11:22:33:44:56',
      paired: false,
      signal: -67,
      battery: 72,
      status: 'Available',
      type: 'Smart Shoe',
    },
    {
      id: 'solemate-003',
      name: 'SoleMate-003',
      address: '00:11:22:33:44:57',
      paired: false,
      signal: -55,
      battery: 91,
      status: 'Available',
      type: 'Smart Shoe',
    },
  ]);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Button animation values
  const scanButtonScale = useRef(new Animated.Value(1)).current;
  const enableButtonScale = useRef(new Animated.Value(1)).current;
  const connectButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    requestPermissions();
    simulateBluetoothCheck();
    startAnimations();
  }, []);

  const startAnimations = () => {
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
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Hover animation functions
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

  const requestPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required for Bluetooth device scanning.'
        );
        return;
      }
      
      setHasPermissions(true);
    } catch (error) {
      console.error('Permission request error:', error);
      Alert.alert('Error', 'Could not request permissions');
    }
  };

  const simulateBluetoothCheck = () => {
    setTimeout(() => {
      setIsEnabled(true);
    }, 1000);
  };

  const enableBluetooth = async () => {
    try {
      Alert.alert(
        'Enable Bluetooth',
        'Please enable Bluetooth in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Settings',
            onPress: () => {
              setIsEnabled(true);
              Alert.alert('Success', 'Bluetooth enabled successfully');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Could not enable Bluetooth');
    }
  };

  const scanForDevices = async () => {
    if (!isEnabled) {
      Alert.alert('Bluetooth Disabled', 'Please enable Bluetooth first');
      return;
    }

    if (!hasPermissions) {
      Alert.alert('Permissions Required', 'Please grant location permissions');
      return;
    }

    setScanning(true);

    setTimeout(() => {
      const newDevice = {
        id: `solemate-${devices.length + 1}`,
        name: `SoleMate-00${devices.length + 1}`,
        address: `00:11:22:33:44:${50 + devices.length}`,
        paired: false,
        signal: Math.floor(Math.random() * 40) - 70,
        battery: Math.floor(Math.random() * 30) + 70,
        status: 'Available',
        type: 'Smart Shoe',
      };

      setDevices(prevDevices => {
        const exists = prevDevices.some(device => device.id === newDevice.id);
        if (!exists) {
          return [...prevDevices, newDevice];
        }
        return prevDevices;
      });

      setScanning(false);
      Alert.alert('Scan Complete', `Found ${devices.length + 1} SoleMate devices`);
    }, 3000);
  };

  const connectToDevice = async (device) => {
    if (!device) return;

    Alert.alert(
      'Connect to Device',
      `Connect to ${device.name}?\n\nAddress: ${device.address}\nBattery: ${device.battery}%`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect',
          onPress: () => {
            setTimeout(() => {
              setDevices(prevDevices =>
                prevDevices.map(d => ({ 
                  ...d, 
                  paired: d.id === device.id, 
                  status: d.id === device.id ? 'Connected' : 'Available' 
                }))
              );

              setIsConnected(true);
              setConnectedDevice({ ...device, paired: true, status: 'Connected' });
              
              Alert.alert(
                'Connection Successful', 
                `Successfully connected to ${device.name}!\n\nYou can now use navigation and object detection features.`
              );
            }, 1500);
          }
        }
      ]
    );
  };

  const disconnectDevice = () => {
    if (!connectedDevice) return;

    Alert.alert(
      'Disconnect Device',
      `Disconnect from ${connectedDevice.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            setDevices(prevDevices =>
              prevDevices.map(d => ({ 
                ...d, 
                paired: false, 
                status: 'Available' 
              }))
            );

            setIsConnected(false);
            setConnectedDevice(null);
            
            Alert.alert('Disconnected', 'Device has been disconnected successfully');
          }
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    
    setDevices(prevDevices =>
      prevDevices.map(device => ({
        ...device,
        battery: Math.max(20, Math.min(100, device.battery + Math.floor(Math.random() * 10 - 5))),
        signal: Math.floor(Math.random() * 40) - 70,
      }))
    );

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getSignalStrength = (signal) => {
    if (!signal) return 'Unknown';
    if (signal > -50) return 'Excellent';
    if (signal > -60) return 'Good';
    if (signal > -70) return 'Fair';
    return 'Poor';
  };

  const getSignalColor = (signal) => {
    if (!signal) return '#9CA3AF';
    if (signal > -50) return '#10B981';
    if (signal > -60) return '#F59E0B';
    if (signal > -70) return '#F97316';
    return '#EF4444';
  };

  const getBatteryIcon = (battery) => {
    if (battery > 75) return 'battery-full';
    if (battery > 50) return 'battery-half';
    if (battery > 25) return 'battery-quarter';
    return 'battery-dead';
  };

  const getBatteryColor = (battery) => {
    if (battery > 50) return '#10B981';
    if (battery > 25) return '#F59E0B';
    return '#EF4444';
  };

  const logoRotate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
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
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}
          <Animated.View style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            <Animated.View style={[
              styles.logoContainer,
              { transform: [{ rotate: logoRotate }] }
            ]}>
              <LinearGradient
                colors={['#FF6B6B', '#4ECDC4']}
                style={styles.logoGradient}
              >
                <Ionicons name="hardware-chip" size={32} color="#fff" />
              </LinearGradient>
            </Animated.View>
            <Text style={styles.title}>SoleMate Connection</Text>
            <Text style={styles.subtitle}>✨ Connect to your smart shoe device ✨</Text>
          </Animated.View>

          {/* Status Cards */}
          <Animated.View style={[
            styles.statusContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            {/* Permission Status */}
            <BlurView intensity={80} style={styles.statusCard}>
              <View style={[styles.statusContent, {
                backgroundColor: hasPermissions ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              }]}>
                <View style={styles.statusHeader}>
                  <LinearGradient
                    colors={hasPermissions ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
                    style={styles.statusIconGradient}
                  >
                    <Ionicons name="shield-checkmark" size={20} color="#fff" />
                  </LinearGradient>
                  <View style={styles.statusText}>
                    <Text style={styles.statusTitle}>
                      Permissions {hasPermissions ? 'Granted' : 'Required'}
                    </Text>
                    <Text style={styles.statusSubtitle}>
                      {hasPermissions ? 'Location access granted' : 'Location permission needed'}
                    </Text>
                  </View>
                  {!hasPermissions && (
                    <Animated.View style={[{ transform: [{ scale: enableButtonScale }] }]}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={requestPermissions}
                        activeOpacity={0.8}
                        {...createHoverAnimation(enableButtonScale)}
                      >
                        <LinearGradient
                          colors={['#667eea', '#764ba2']}
                          style={styles.actionButtonGradient}
                        >
                          <Text style={styles.actionButtonText}>Grant</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </View>
              </View>
            </BlurView>

            {/* Bluetooth Status */}
            <BlurView intensity={80} style={styles.statusCard}>
              <View style={[styles.statusContent, {
                backgroundColor: isEnabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              }]}>
                <View style={styles.statusHeader}>
                  <LinearGradient
                    colors={isEnabled ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
                    style={styles.statusIconGradient}
                  >
                    <Ionicons name="bluetooth" size={20} color="#fff" />
                  </LinearGradient>
                  <View style={styles.statusText}>
                    <Text style={styles.statusTitle}>
                      Bluetooth {isEnabled ? 'Enabled' : 'Disabled'}
                    </Text>
                    <Text style={styles.statusSubtitle}>
                      {isEnabled ? 'Ready to scan for devices' : 'Enable Bluetooth to continue'}
                    </Text>
                  </View>
                  {!isEnabled && (
                    <Animated.View style={[{ transform: [{ scale: enableButtonScale }] }]}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={enableBluetooth}
                        activeOpacity={0.8}
                        {...createHoverAnimation(enableButtonScale)}
                      >
                        <LinearGradient
                          colors={['#667eea', '#764ba2']}
                          style={styles.actionButtonGradient}
                        >
                          <Text style={styles.actionButtonText}>Enable</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </View>
              </View>
            </BlurView>

            {/* Connection Status */}
            {isEnabled && (
              <BlurView intensity={80} style={styles.statusCard}>
                <View style={[styles.statusContent, {
                  backgroundColor: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                }]}>
                  <View style={styles.statusHeader}>
                    <LinearGradient
                      colors={isConnected ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
                      style={styles.statusIconGradient}
                    >
                      <Ionicons name="link" size={20} color="#fff" />
                    </LinearGradient>
                    <View style={styles.statusText}>
                      <Text style={styles.statusTitle}>
                        {isConnected ? 'Connected' : 'Not Connected'}
                      </Text>
                      <Text style={styles.statusSubtitle}>
                        {isConnected ? connectedDevice?.name : 'No SoleMate device connected'}
                      </Text>
                    </View>
                    {isConnected && (
                      <Animated.View style={[{ transform: [{ scale: enableButtonScale }] }]}>
                        <TouchableOpacity 
                          style={styles.disconnectButton}
                          onPress={disconnectDevice}
                          activeOpacity={0.8}
                          {...createHoverAnimation(enableButtonScale)}
                        >
                          <LinearGradient
                            colors={['#EF4444', '#DC2626']}
                            style={styles.actionButtonGradient}
                          >
                            <Text style={styles.actionButtonText}>Disconnect</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </Animated.View>
                    )}
                  </View>

                  {isConnected && connectedDevice && (
                    <View style={styles.deviceDetails}>
                      <View style={styles.deviceDetail}>
                        <Ionicons 
                          name={getBatteryIcon(connectedDevice.battery)} 
                          size={16} 
                          color={getBatteryColor(connectedDevice.battery)} 
                        />
                        <Text style={styles.deviceDetailText}>
                          Battery: {connectedDevice.battery}%
                        </Text>
                      </View>
                      <View style={styles.deviceDetail}>
                        <Ionicons name="radio" size={16} color="#667eea" />
                        <Text style={styles.deviceDetailText}>
                          Signal: {getSignalStrength(connectedDevice.signal)}
                        </Text>
                      </View>
                      <View style={styles.deviceDetail}>
                        <Ionicons name="finger-print" size={16} color="#667eea" />
                        <Text style={styles.deviceDetailText}>
                          Address: {connectedDevice.address}
                        </Text>
                      </View>
                      <View style={styles.deviceDetail}>
                        <Ionicons name="checkmark-circle" size={16} color="#667eea" />
                        <Text style={styles.deviceDetailText}>
                          Type: {connectedDevice.type}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </BlurView>
            )}
          </Animated.View>

          {/* Scan Button */}
          {isEnabled && hasPermissions && (
            <Animated.View style={[
              { opacity: fadeAnim, transform: [{ scale: scanButtonScale }] }
            ]}>
              <TouchableOpacity
                style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
                onPress={scanForDevices}
                disabled={scanning}
                activeOpacity={0.8}
                {...createHoverAnimation(scanButtonScale)}
              >
                <LinearGradient
                  colors={scanning ? ['#9CA3AF', '#9CA3AF'] : ['#667eea', '#764ba2']}
                  style={styles.scanButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {scanning ? (
                    <>
                      <ActivityIndicator size="small" color="#FFFFFF" style={styles.scanIcon} />
                      <Text style={styles.scanButtonText}>Scanning for SoleMate Devices...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="search" size={18} color="#fff" style={styles.scanIcon} />
                      <Text style={styles.scanButtonText}>Scan for SoleMate Devices</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Available Devices */}
          {isEnabled && devices.length > 0 && (
            <Animated.View style={[
              styles.devicesContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}>
              <BlurView intensity={80} style={styles.devicesCard}>
                <View style={styles.devicesContent}>
                  <View style={styles.devicesHeader}>
                    <Text style={styles.devicesTitle}>Available SoleMate Devices</Text>
                    <View style={styles.deviceCountBadge}>
                      <Text style={styles.deviceCountText}>{devices.length} found</Text>
                    </View>
                  </View>
                  
                  <View style={styles.deviceList}>
                    {devices.map((device, index) => (
                      <Animated.View 
                        key={device.id} 
                        style={[
                          styles.deviceItem,
                          { transform: [{ scale: pulseAnim }] }
                        ]}
                      >
                        <View style={styles.deviceInfo}>
                          <LinearGradient
                            colors={device.paired ? ['#10B981', '#059669'] : ['#667eea', '#764ba2']}
                            style={styles.deviceIcon}
                          >
                            <Ionicons 
                              name="hardware-chip" 
                              size={24} 
                              color="#fff" 
                            />
                          </LinearGradient>
                          
                          <View style={styles.deviceInfoText}>
                            <Text style={styles.deviceName}>{device.name}</Text>
                            <Text style={styles.deviceType}>{device.type}</Text>
                            <View style={styles.deviceStats}>
                              <View style={styles.deviceStat}>
                                <View style={[styles.signalDot, { 
                                  backgroundColor: getSignalColor(device.signal) 
                                }]} />
                                <Text style={styles.deviceStatText}>
                                  {device.signal} dBm
                                </Text>
                              </View>
                              <View style={styles.deviceStat}>
                                <Ionicons 
                                  name={getBatteryIcon(device.battery)} 
                                  size={12} 
                                  color={getBatteryColor(device.battery)} 
                                />
                                <Text style={styles.deviceStatText}>
                                  {device.battery}%
                                </Text>
                              </View>
                              <View style={styles.deviceStat}>
                                <Ionicons name="finger-print" size={12} color="#667eea" />
                                <Text style={styles.deviceStatText}>
                                  {device.address.slice(-5)}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>

                        <View style={styles.deviceAction}>
                          {device.paired ? (
                            <View style={styles.connectedBadge}>
                              <Ionicons name="checkmark-circle" size={12} color="#059669" />
                              <Text style={styles.connectedBadgeText}>Connected</Text>
                            </View>
                          ) : (
                            <Animated.View style={[{ transform: [{ scale: connectButtonScale }] }]}>
                              <TouchableOpacity
                                style={styles.connectButton}
                                onPress={() => connectToDevice(device)}
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
                      </Animated.View>
                    ))}
                  </View>
                </View>
              </BlurView>
            </Animated.View>
          )}

          {/* Help Section */}
          <Animated.View style={[
            styles.helpContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            <BlurView intensity={80} style={styles.helpCard}>
              <View style={styles.helpContent}>
                <Text style={styles.helpTitle}>Connection Help</Text>
                <View style={styles.helpItems}>
                  {[
                    { icon: 'information-circle', text: 'Make sure your SoleMate device is powered on and in pairing mode' },
                    { icon: 'refresh', text: 'Pull down to refresh device status or tap scan to find new devices' },
                    { icon: 'shield-checkmark', text: 'Only connect to trusted SoleMate devices with proper authentication' },
                    { icon: 'location', text: 'Location permissions are required for Bluetooth device discovery' },
                    { icon: 'build', text: 'For full functionality, install the app on a physical device' }
                  ].map((item, index) => (
                    <View key={index} style={styles.helpItem}>
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.helpIconGradient}
                      >
                        <Ionicons name={item.icon} size={16} color="#fff" />
                      </LinearGradient>
                      <Text style={styles.helpText}>{item.text}</Text>
                    </View>
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

