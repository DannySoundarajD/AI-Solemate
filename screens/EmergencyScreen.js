import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Switch,
  Dimensions,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import styles from "../styles/EmergencyStyles"

const { width, height } = Dimensions.get('window');

export default function EmergencyScreen() {
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: 'Emergency Services', number: '911', type: 'emergency' },
    { id: 2, name: 'John Doe', number: '+1234567890', type: 'personal' },
    { id: 3, name: 'Jane Smith', number: '+1987654321', type: 'personal' },
  ]);
  const [currentLocation, setCurrentLocation] = useState('123 Main Street, Downtown');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const statusPulseAnim = useRef(new Animated.Value(1)).current;
  const emergencyButtonScale = useRef(new Animated.Value(1)).current;

  // Individual button animations
  const quickActionAnimations = useRef(
    Array.from({ length: 3 }, () => new Animated.Value(1))
  ).current;
  const contactItemAnimations = useRef(
    emergencyContacts.map(() => new Animated.Value(1))
  ).current;

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

    // Emergency alert pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
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

  const sendEmergencyAlert = () => {
    Alert.alert(
      'Send Emergency Alert',
      'This will send your location and emergency alert to all your emergency contacts.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Alert',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Emergency Alert Sent',
              'Your location and emergency alert have been sent to all emergency contacts.'
            );
          }
        }
      ]
    );
  };

  const callEmergencyContact = (contact) => {
    Alert.alert(
      'Call Emergency Contact',
      `Call ${contact.name} at ${contact.number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${contact.number}`);
          }
        }
      ]
    );
  };

  const quickAction = (action) => {
    switch (action) {
      case 'voice':
        Alert.alert('Voice Alert', 'Voice alert activated. Speaking location aloud.');
        break;
      case 'flashlight':
        Alert.alert('Flashlight', 'Emergency flashlight activated');
        break;
      case 'medical':
        Alert.alert('Medical Info', 'Medical information accessed');
        break;
    }
  };

  const logoRotate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#FF6B6B', '#EE5A52', '#FF8E53']}
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
                      colors={['#FF4444', '#CC1B1B']}
                      style={styles.logoGradient}
                    >
                      <Ionicons name="warning" size={24} color="#fff" />
                    </LinearGradient>
                  </Animated.View>
                  <View style={styles.titleContainer}>
                    <Text style={styles.appTitleText}>Emergency</Text>
                    <Animated.View style={[
                      styles.statusDot, 
                      { 
                        backgroundColor: '#FF4444',
                        transform: [{ scale: statusPulseAnim }]
                      }
                    ]} />
                  </View>
                </View>
                
                <View style={styles.statusInfo}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                    style={styles.locationStatusContainer}
                  >
                    <Ionicons name="location" size={16} color="#FFFFFF" />
                    <Text style={styles.locationStatusText}>
                      {isLocationEnabled ? 'Active' : 'Disabled'}
                    </Text>
                  </LinearGradient>
                </View>
              </View>

              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>Emergency Ready</Text>
                <Text style={styles.welcomeSubtitle}>Quick access to emergency services</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Emergency Alert Button */}
          <Animated.View style={[
            styles.cardContainer,
            { 
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { scale: emergencyButtonScale },
                { scale: pulseAnim }
              ]
            }
          ]}>
            <TouchableOpacity
              onPress={sendEmergencyAlert}
              activeOpacity={0.8}
              {...createHoverAnimation(emergencyButtonScale, 1.02)}
            >
              <BlurView intensity={80} style={styles.blurContainer}>
                <LinearGradient
                  colors={['#FF4444', '#CC1B1B']}
                  style={styles.emergencyCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.emergencyButtonContent}>
                    <Ionicons name="alert-circle" size={48} color="#FFFFFF" />
                    <Text style={styles.emergencyButtonText}>SEND EMERGENCY ALERT</Text>
                    <Text style={styles.emergencyButtonSubtext}>
                      Tap to send location and alert to all contacts
                    </Text>
                  </View>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          {/* Current Location Card */}
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
                    colors={['#10B981', '#059669']}
                    style={styles.iconGradient}
                  >
                    <Ionicons name="location" size={16} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.cardTitle}>Current Location</Text>
                  <View style={styles.locationStatus}>
                    <Animated.View style={[
                      styles.statusIndicator, 
                      { 
                        backgroundColor: isLocationEnabled ? '#10B981' : '#EF4444',
                        transform: [{ scale: statusPulseAnim }]
                      }
                    ]} />
                    <Text style={[styles.statusText, {
                      color: isLocationEnabled ? '#065F46' : '#991B1B'
                    }]}>
                      {isLocationEnabled ? 'Active' : 'Disabled'}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.locationText}>{currentLocation}</Text>
                
                <View style={styles.locationActions}>
                  <TouchableOpacity 
                    style={styles.shareButton}
                    onPress={() => Alert.alert('Location Shared', 'Current location shared with emergency contacts')}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['#3B82F6', '#2563EB']}
                      style={styles.shareButtonGradient}
                    >
                      <Ionicons name="share" size={14} color="#FFFFFF" />
                      <Text style={styles.shareButtonText}>Share Location</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <View style={styles.locationToggle}>
                    <Text style={styles.toggleLabel}>Auto-share</Text>
                    <Switch
                      value={isLocationEnabled}
                      onValueChange={setIsLocationEnabled}
                      trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
                      thumbColor={isLocationEnabled ? '#3B82F6' : '#9CA3AF'}
                    />
                  </View>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Emergency Contacts Card */}
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
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.iconGradient}
                  >
                    <Ionicons name="people" size={16} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.cardTitle}>Emergency Contacts</Text>
                  <View style={styles.contactCountBadge}>
                    <Text style={styles.contactCount}>{emergencyContacts.length}</Text>
                  </View>
                </View>

                <View style={styles.contactsList}>
                  {emergencyContacts.map((contact, index) => (
                    <Animated.View 
                      key={contact.id}
                      style={[{ transform: [{ scale: contactItemAnimations[index] }] }]}
                    >
                      <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => callEmergencyContact(contact)}
                        activeOpacity={0.7}
                        {...createHoverAnimation(contactItemAnimations[index], 1.02)}
                      >
                        <View style={styles.contactInfo}>
                          <LinearGradient
                            colors={contact.type === 'emergency' ? ['#EF4444', '#DC2626'] : ['#3B82F6', '#2563EB']}
                            style={styles.contactIcon}
                          >
                            <Ionicons 
                              name={contact.type === 'emergency' ? 'medical' : 'person'} 
                              size={16} 
                              color="#FFFFFF" 
                            />
                          </LinearGradient>
                          
                          <View style={styles.contactDetails}>
                            <Text style={styles.contactName}>{contact.name}</Text>
                            <Text style={styles.contactNumber}>{contact.number}</Text>
                          </View>
                        </View>

                        <LinearGradient
                          colors={['#10B981', '#059669']}
                          style={styles.callButton}
                        >
                          <Ionicons name="call" size={14} color="#FFFFFF" />
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                </View>

                <TouchableOpacity style={styles.addContactButton} activeOpacity={0.7}>
                  <LinearGradient
                    colors={['rgba(139, 92, 246, 0.1)', 'rgba(139, 92, 246, 0.05)']}
                    style={styles.addContactGradient}
                  >
                    <Ionicons name="add" size={16} color="#8B5CF6" />
                    <Text style={styles.addContactText}>Add Emergency Contact</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Animated.View>

          

          {/* Emergency Instructions Card */}
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
                    colors={['#6366F1', '#4F46E5']}
                    style={styles.iconGradient}
                  >
                    <Ionicons name="information-circle" size={16} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.cardTitle}>Emergency Instructions</Text>
                </View>

                <View style={styles.instructionsList}>
                  {[
                    'Stay calm and assess your situation',
                    'Use the emergency alert button to notify contacts',
                    'Call emergency services if immediate help is needed',
                    'Share your location with trusted contacts'
                  ].map((instruction, index) => (
                    <View key={index} style={styles.instructionItem}>
                      <LinearGradient
                        colors={['#EF4444', '#DC2626']}
                        style={styles.instructionNumber}
                      >
                        <Text style={styles.instructionNumberText}>{index + 1}</Text>
                      </LinearGradient>
                      <Text style={styles.instructionText}>{instruction}</Text>
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

