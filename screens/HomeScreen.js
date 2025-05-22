import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [currentLocation, setCurrentLocation] = useState('Searching for location...');
  const [destination, setDestination] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const [directions, setDirections] = useState([]);

  useEffect(() => {
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#3B82F6', '#1E40AF']}
        style={styles.header}
      >
        <View style={styles.statusBar}>
          <View style={styles.appTitle}>
            <Text style={styles.appTitleText}>SoleMate</Text>
            <View style={[styles.statusDot, { backgroundColor: isConnected ? '#10B981' : '#EF4444' }]} />
          </View>
          
          <View style={styles.statusInfo}>
            <View style={styles.batteryInfo}>
              <Ionicons name="battery-half" size={16} color="#FFFFFF" />
              <Text style={styles.batteryText}>{batteryLevel}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to SoleMate</Text>
          <Text style={styles.welcomeSubtitle}>Your smart navigation companion</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Connection Status */}
        <View style={[styles.card, styles.connectionCard, {
          backgroundColor: isConnected ? '#ECFDF5' : '#FEF2F2',
          borderColor: isConnected ? '#10B981' : '#EF4444'
        }]}>
          <View style={styles.connectionStatus}>
            <View style={[styles.connectionDot, { backgroundColor: isConnected ? '#10B981' : '#EF4444' }]} />
            <Text style={[styles.connectionText, { color: isConnected ? '#065F46' : '#991B1B' }]}>
              {isConnected ? 'SoleMate Device Connected' : 'Device Not Connected'}
            </Text>
          </View>
          {!isConnected && (
            <TouchableOpacity 
              style={styles.connectButton}
              onPress={() => setIsConnected(true)}
            >
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Current Location */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={20} color="#3B82F6" />
            <Text style={styles.cardTitle}>Current Location</Text>
          </View>
          <Text style={styles.locationText}>{currentLocation}</Text>
        </View>

        {/* Navigation Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Navigation</Text>
          
          <View style={styles.inputContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Where would you like to go?"
              value={destination}
              onChangeText={setDestination}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <TouchableOpacity
            style={[styles.navigationButton, {
              backgroundColor: isConnected ? '#3B82F6' : '#9CA3AF'
            }]}
            onPress={isNavigating ? stopNavigation : startNavigation}
            disabled={!isConnected && !isNavigating}
          >
            <Ionicons 
              name={isNavigating ? 'stop' : 'navigate'} 
              size={20} 
              color="#FFFFFF" 
              style={styles.buttonIcon} 
            />
            <Text style={styles.navigationButtonText}>
              {isNavigating ? 'Stop Navigation' : 'Start Navigation'}
            </Text>
          </TouchableOpacity>

          {/* Directions */}
          {isNavigating && directions.length > 0 && (
            <View style={styles.directionsContainer}>
              <Text style={styles.directionsTitle}>Current Directions</Text>
              {directions.map((direction, index) => (
                <View key={index} style={styles.directionItem}>
                  <Text style={styles.directionNumber}>{index + 1}</Text>
                  <Text style={styles.directionText}>{direction}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => quickAction('voice')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#10B981' }]}>
                <Ionicons name="volume-high" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>Voice Guide</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => quickAction('detection')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#8B5CF6' }]}>
                <Ionicons name="eye" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>Detect Objects</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => quickAction('location')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#F59E0B' }]}>
                <Ionicons name="location-sharp" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>My Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
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
  appTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
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
  batteryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 4,
  },
  welcomeSection: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#BFDBFE',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    padding: 20,
    paddingTop: 25,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  connectionCard: {
    borderWidth: 1,
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
    fontWeight: '600',
    flex: 1,
  },
  connectButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonIcon: {
    marginRight: 8,
  },
  navigationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  directionsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  directionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 12,
  },
  directionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  directionNumber: {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 20,
    marginRight: 12,
  },
  directionText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
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
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});