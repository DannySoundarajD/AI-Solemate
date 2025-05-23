import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { settingsStyles } from '../styles/SettingsStyles';

const { width, height } = Dimensions.get('window');

export default function SettingsScreen() {
  // State
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState(80);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoDetection, setAutoDetection] = useState(false);
  const [detectionSensitivity, setDetectionSensitivity] = useState('medium');
  const [batteryOptimization, setBatteryOptimization] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState({
    name: 'SoleMate Device',
    version: '2.1.0',
    battery: 85,
    status: 'Connected'
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const statusPulseAnim = useRef(new Animated.Value(1)).current;
  
  // Button animation values
  const saveButtonScale = useRef(new Animated.Value(1)).current;
  const resetButtonScale = useRef(new Animated.Value(1)).current;
  const backButtonScale = useRef(new Animated.Value(1)).current;

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

    // Status pulse animation
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

  const handleSaveSettings = () => {
    Alert.alert('Settings Saved', 'Your preferences have been updated successfully');
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          onPress: () => {
            setVoiceEnabled(true);
            setVoiceVolume(80);
            setHapticFeedback(true);
            setAutoDetection(false);
            setDetectionSensitivity('medium');
            setBatteryOptimization(true);
            setPrivacyMode(false);
            setNotifications(true);
            setDarkMode(false);
          }
        }
      ]
    );
  };

  const handleDeviceInfo = () => {
    Alert.alert(
      'Device Information',
      `Name: ${deviceInfo.name}\nVersion: ${deviceInfo.version}\nBattery: ${deviceInfo.battery}%\nStatus: ${deviceInfo.status}`
    );
  };

  const logoRotate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderSettingItem = (icon, title, description, value, onValueChange, type = 'switch', options = []) => (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)']}
      style={settingsStyles.settingItem}
    >
      <View style={settingsStyles.settingLeft}>
        <LinearGradient
          colors={['#8B5CF6', '#7C3AED']}
          style={settingsStyles.settingIcon}
        >
          <Ionicons name={icon} size={20} color="#fff" />
        </LinearGradient>
        
        <View style={settingsStyles.settingInfo}>
          <Text style={settingsStyles.settingTitle}>{title}</Text>
          <Text style={settingsStyles.settingDescription}>{description}</Text>
        </View>
      </View>

      <View style={settingsStyles.settingRight}>
        {type === 'switch' && (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
            thumbColor={value ? '#FFFFFF' : '#F3F4F6'}
          />
        )}
        {type === 'selector' && (
          <TouchableOpacity 
            style={settingsStyles.selectorButton}
            onPress={() => {
              Alert.alert(
                title,
                'Select option:',
                options.map(option => ({
                  text: option.label,
                  onPress: () => onValueChange(option.value)
                }))
              );
            }}
          >
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.1)', 'rgba(124, 58, 237, 0.1)']}
              style={settingsStyles.selectorGradient}
            >
              <Text style={settingsStyles.selectorText}>{value}</Text>
              <Ionicons name="chevron-down" size={16} color="#8B5CF6" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
        style={settingsStyles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Animated Background Elements */}
        <View style={settingsStyles.backgroundElements}>
          <Animated.View style={[settingsStyles.floatingElement, settingsStyles.element1, {
            transform: [{ rotate: logoRotate }]
          }]} />
          <Animated.View style={[settingsStyles.floatingElement, settingsStyles.element2, {
            transform: [{ rotate: logoRotate }]
          }]} />
          <Animated.View style={[settingsStyles.floatingElement, settingsStyles.element3, {
            transform: [{ rotate: logoRotate }]
          }]} />
        </View>

        <ScrollView 
          style={settingsStyles.scrollView}
          contentContainerStyle={settingsStyles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View style={[
            settingsStyles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
              style={settingsStyles.headerGradient}
            >
              <View style={settingsStyles.statusBar}>
                <TouchableOpacity style={settingsStyles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                
                <View style={settingsStyles.appTitle}>
                  <Animated.View style={[
                    settingsStyles.logoIconContainer,
                    { transform: [{ rotate: logoRotate }] }
                  ]}>
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      style={settingsStyles.logoGradient}
                    >
                      <Ionicons name="settings" size={24} color="#fff" />
                    </LinearGradient>
                  </Animated.View>
                  <View style={settingsStyles.titleContainer}>
                    <Text style={settingsStyles.appTitleText}>Settings</Text>
                    <Animated.View style={[
                      settingsStyles.statusDot, 
                      { 
                        backgroundColor: isConnected ? '#10B981' : '#EF4444',
                        transform: [{ scale: statusPulseAnim }]
                      }
                    ]} />
                  </View>
                </View>
                
                <View style={settingsStyles.statusInfo}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                    style={settingsStyles.batteryContainer}
                  >
                    <Ionicons name="battery-half" size={16} color="#FFFFFF" />
                    <Text style={settingsStyles.batteryText}>{deviceInfo.battery}%</Text>
                  </LinearGradient>
                </View>
              </View>

              <View style={settingsStyles.welcomeSection}>
                <Text style={settingsStyles.welcomeTitle}>Device Settings</Text>
                <Text style={settingsStyles.welcomeSubtitle}>Customize your SoleMate experience</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Device Status Card */}
          <Animated.View style={[
            settingsStyles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            <BlurView intensity={80} style={settingsStyles.blurContainer}>
              <View style={[settingsStyles.card, settingsStyles.statusCard]}>
                <View style={settingsStyles.statusHeader}>
                  <View style={settingsStyles.statusLeft}>
                    <LinearGradient
                      colors={['#8B5CF6', '#7C3AED']}
                      style={settingsStyles.iconGradient}
                    >
                      <Ionicons name="hardware-chip" size={20} color="#fff" />
                    </LinearGradient>
                    <View style={settingsStyles.statusInfo}>
                      <Text style={settingsStyles.statusTitle}>Device Status</Text>
                      <Text style={settingsStyles.statusText}>{deviceInfo.status}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={handleDeviceInfo}>
                    <LinearGradient
                      colors={['rgba(139, 92, 246, 0.1)', 'rgba(124, 58, 237, 0.1)']}
                      style={settingsStyles.infoButton}
                    >
                      <Ionicons name="information-circle" size={20} color="#8B5CF6" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Voice & Audio Settings */}
          <Animated.View style={[
            settingsStyles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            <BlurView intensity={80} style={settingsStyles.blurContainer}>
              <View style={settingsStyles.card}>
                <View style={settingsStyles.cardHeader}>
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={settingsStyles.iconGradient}
                  >
                    <Ionicons name="volume-high" size={16} color="#fff" />
                  </LinearGradient>
                  <Text style={settingsStyles.cardTitle}>Voice & Audio</Text>
                </View>
                
                <View style={settingsStyles.settingsList}>
                  {renderSettingItem(
                    'volume-high',
                    'Voice Announcements',
                    'Enable voice feedback for detected objects',
                    voiceEnabled,
                    setVoiceEnabled
                  )}
                  
                  {renderSettingItem(
                    'musical-notes',
                    'Audio Volume',
                    'Adjust voice announcement volume',
                    voiceVolume > 80 ? 'High' : voiceVolume > 50 ? 'Medium' : 'Low',
                    (value) => {
                      const volumeMap = { 'Low': 30, 'Medium': 60, 'High': 90 };
                      setVoiceVolume(volumeMap[value]);
                    },
                    'selector',
                    [
                      { label: 'Low', value: 'Low' },
                      { label: 'Medium', value: 'Medium' },
                      { label: 'High', value: 'High' }
                    ]
                  )}
                  
                  {renderSettingItem(
                    'phone-portrait',
                    'Haptic Feedback',
                    'Vibration alerts for important notifications',
                    hapticFeedback,
                    setHapticFeedback
                  )}
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Detection Settings */}
          <Animated.View style={[
            settingsStyles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            <BlurView intensity={80} style={settingsStyles.blurContainer}>
              <View style={settingsStyles.card}>
                <View style={settingsStyles.cardHeader}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={settingsStyles.iconGradient}
                  >
                    <Ionicons name="eye" size={16} color="#fff" />
                  </LinearGradient>
                  <Text style={settingsStyles.cardTitle}>Detection Settings</Text>
                </View>
                
                <View style={settingsStyles.settingsList}>
                  {renderSettingItem(
                    'refresh',
                    'Auto Detection',
                    'Automatically start detection when app opens',
                    autoDetection,
                    setAutoDetection
                  )}
                  
                  {renderSettingItem(
                    'speedometer',
                    'Detection Sensitivity',
                    'Adjust how sensitive object detection is',
                    detectionSensitivity.charAt(0).toUpperCase() + detectionSensitivity.slice(1),
                    setDetectionSensitivity,
                    'selector',
                    [
                      { label: 'Low', value: 'low' },
                      { label: 'Medium', value: 'medium' },
                      { label: 'High', value: 'high' }
                    ]
                  )}
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Privacy & Security */}
          <Animated.View style={[
            settingsStyles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            <BlurView intensity={80} style={settingsStyles.blurContainer}>
              <View style={settingsStyles.card}>
                <View style={settingsStyles.cardHeader}>
                  <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    style={settingsStyles.iconGradient}
                  >
                    <Ionicons name="shield-checkmark" size={16} color="#fff" />
                  </LinearGradient>
                  <Text style={settingsStyles.cardTitle}>Privacy & Security</Text>
                </View>
                
                <View style={settingsStyles.settingsList}>
                  {renderSettingItem(
                    'eye-off',
                    'Privacy Mode',
                    'Disable data collection and analytics',
                    privacyMode,
                    setPrivacyMode
                  )}
                  
                  {renderSettingItem(
                    'notifications',
                    'Notifications',
                    'Receive app notifications and updates',
                    notifications,
                    setNotifications
                  )}
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* System Settings */}
          <Animated.View style={[
            settingsStyles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            <BlurView intensity={80} style={settingsStyles.blurContainer}>
              <View style={settingsStyles.card}>
                <View style={settingsStyles.cardHeader}>
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    style={settingsStyles.iconGradient}
                  >
                    <Ionicons name="construct" size={16} color="#fff" />
                  </LinearGradient>
                  <Text style={settingsStyles.cardTitle}>System</Text>
                </View>
                
                <View style={settingsStyles.settingsList}>
                  {renderSettingItem(
                    'battery-charging',
                    'Battery Optimization',
                    'Optimize performance to save battery',
                    batteryOptimization,
                    setBatteryOptimization
                  )}
                  
                  {renderSettingItem(
                    'moon',
                    'Dark Mode',
                    'Use dark theme for better visibility',
                    darkMode,
                    setDarkMode
                  )}
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View style={[
            settingsStyles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            <BlurView intensity={80} style={settingsStyles.blurContainer}>
              <View style={settingsStyles.card}>
                <View style={settingsStyles.actionButtons}>
                  <Animated.View style={[{ transform: [{ scale: saveButtonScale }] }]}>
                    <TouchableOpacity
                      style={settingsStyles.primaryButton}
                      onPress={handleSaveSettings}
                      activeOpacity={0.8}
                      {...createHoverAnimation(saveButtonScale)}
                    >
                      <LinearGradient
                        colors={['#10B981', '#059669']}
                        style={settingsStyles.primaryButtonGradient}
                      >
                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                        <Text style={settingsStyles.primaryButtonText}>Save Settings</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>

                  <Animated.View style={[{ transform: [{ scale: resetButtonScale }] }]}>
                    <TouchableOpacity 
                      style={settingsStyles.secondaryButton}
                      onPress={handleResetSettings}
                      {...createHoverAnimation(resetButtonScale)}
                    >
                      <LinearGradient
                        colors={['rgba(239, 68, 68, 0.1)', 'rgba(220, 38, 38, 0.1)']}
                        style={settingsStyles.secondaryButtonGradient}
                      >
                        <Ionicons name="refresh" size={18} color="#EF4444" />
                        <Text style={[settingsStyles.secondaryButtonText, { color: '#EF4444' }]}>Reset to Default</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* App Information */}
          <Animated.View style={[
            settingsStyles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            <BlurView intensity={80} style={settingsStyles.blurContainer}>
              <View style={settingsStyles.card}>
                <View style={settingsStyles.cardHeader}>
                  <LinearGradient
                    colors={['#6B7280', '#4B5563']}
                    style={settingsStyles.iconGradient}
                  >
                    <Ionicons name="information-circle" size={16} color="#fff" />
                  </LinearGradient>
                  <Text style={settingsStyles.cardTitle}>About</Text>
                </View>
                
                <View style={settingsStyles.aboutSection}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.4)']}
                    style={settingsStyles.aboutItem}
                  >
                    <Text style={settingsStyles.aboutLabel}>App Version</Text>
                    <Text style={settingsStyles.aboutValue}>1.0.0</Text>
                  </LinearGradient>
                  
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.4)']}
                    style={settingsStyles.aboutItem}
                  >
                    <Text style={settingsStyles.aboutLabel}>Device Model</Text>
                    <Text style={settingsStyles.aboutValue}>{deviceInfo.name}</Text>
                  </LinearGradient>
                  
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.4)']}
                    style={settingsStyles.aboutItem}
                  >
                    <Text style={settingsStyles.aboutLabel}>Firmware</Text>
                    <Text style={settingsStyles.aboutValue}>{deviceInfo.version}</Text>
                  </LinearGradient>
                </View>
              </View>
            </BlurView>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}