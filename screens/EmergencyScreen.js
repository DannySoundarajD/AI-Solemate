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
                    colors={['#F59E0B', '#D97706']}
                    style={styles.iconGradient}
                  >
                    <Ionicons name="flash" size={16} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.cardTitle}>Quick Actions</Text>
                </View>

                <View style={styles.quickActions}>
                  {[
                    { icon: 'volume-high', colors: ['#10B981', '#059669'], action: 'voice', text: 'Voice Alert' },
                    { icon: 'flashlight', colors: ['#F59E0B', '#D97706'], action: 'flashlight', text: 'Flashlight' },
                    { icon: 'medical', colors: ['#8B5CF6', '#7C3AED'], action: 'medical', text: 'Medical Info' }
                  ].map((item, index) => (
                    <Animated.View 
                      key={index}
                      style={[{ transform: [{ scale: quickActionAnimations[index] }] }]}
                    >
                      <TouchableOpacity 
                        style={styles.quickActionButton}
                        onPress={() => quickAction(item.action)}
                        activeOpacity={0.7}
                        {...createHoverAnimation(quickActionAnimations[index], 1.1)}
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
    shadowColor: '#FF4444',
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
  locationStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  locationStatusText: {
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
  emergencyCard: {
    padding: 28,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 68, 68, 0.95)',
  },
  emergencyButtonContent: {
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  emergencyButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
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
    color: '#1F2937',
    flex: 1,
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '500',
  },
  locationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shareButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  locationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
    fontWeight: '500',
  },
  contactCountBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  contactCount: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  contactsList: {
    gap: 12,
    marginTop: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.5)',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  contactNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  callButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addContactButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addContactGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
  },
  addContactText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    color: '#4B5563',
    textAlign: 'center',
    fontWeight: '600',
  },
  instructionsList: {
    marginTop: 16,
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    fontWeight: '500',
  },
});