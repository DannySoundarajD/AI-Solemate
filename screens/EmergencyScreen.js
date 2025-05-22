import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function EmergencyScreen() {
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: 'Emergency Services', number: '911', type: 'emergency' },
    { id: 2, name: 'John Doe', number: '+1234567890', type: 'personal' },
    { id: 3, name: 'Jane Smith', number: '+1987654321', type: 'personal' },
  ]);
  const [currentLocation, setCurrentLocation] = useState('123 Main Street, Downtown');

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
      case 'location':
        Alert.alert('Share Location', 'Current location shared with emergency contacts');
        break;
      case 'medical':
        Alert.alert('Medical Info', 'Medical information accessed');
        break;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#EF4444', '#DC2626']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="warning" size={32} color="#FFFFFF" />
          <Text style={styles.title}>Emergency</Text>
          <Text style={styles.subtitle}>Quick access to emergency services</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Emergency Alert Button */}
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={sendEmergencyAlert}
        >
          <View style={styles.emergencyButtonContent}>
            <Ionicons name="alert-circle" size={48} color="#FFFFFF" />
            <Text style={styles.emergencyButtonText}>SEND EMERGENCY ALERT</Text>
            <Text style={styles.emergencyButtonSubtext}>
              Tap to send location and alert to all contacts
            </Text>
          </View>
        </TouchableOpacity>

        {/* Current Location */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleSection}>
              <Ionicons name="location" size={20} color="#EF4444" />
              <Text style={styles.cardTitle}>Current Location</Text>
            </View>
            <View style={styles.locationStatus}>
              <View style={[styles.statusDot, { 
                backgroundColor: isLocationEnabled ? '#10B981' : '#EF4444' 
              }]} />
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
              style={styles.locationButton}
              onPress={() => quickAction('location')}
            >
              <Ionicons name="share" size={16} color="#3B82F6" />
              <Text style={styles.locationButtonText}>Share Location</Text>
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

        {/* Emergency Contacts */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleSection}>
              <Ionicons name="people" size={20} color="#EF4444" />
              <Text style={styles.cardTitle}>Emergency Contacts</Text>
            </View>
            <Text style={styles.contactCount}>{emergencyContacts.length} contacts</Text>
          </View>

          <View style={styles.contactsList}>
            {emergencyContacts.map((contact) => (
              <View key={contact.id} style={styles.contactItem}>
                <View style={styles.contactInfo}>
                  <View style={[styles.contactIcon, {
                    backgroundColor: contact.type === 'emergency' ? '#EF4444' : '#3B82F6'
                  }]}>
                    <Ionicons 
                      name={contact.type === 'emergency' ? 'medical' : 'person'} 
                      size={20} 
                      color="#FFFFFF" 
                    />
                  </View>
                  
                  <View style={styles.contactDetails}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactNumber}>{contact.number}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => callEmergencyContact(contact)}
                >
                  <Ionicons name="call" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.addContactButton}>
            <Ionicons name="add" size={16} color="#3B82F6" />
            <Text style={styles.addContactText}>Add Emergency Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Emergency Actions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleSection}>
              <Ionicons name="flash" size={20} color="#EF4444" />
              <Text style={styles.cardTitle}>Quick Actions</Text>
            </View>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => quickAction('voice')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#10B981' }]}>
                <Ionicons name="volume-high" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>Voice Alert</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => quickAction('flashlight')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#F59E0B' }]}>
                <Ionicons name="flashlight" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>Flashlight</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => quickAction('medical')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#8B5CF6' }]}>
                <Ionicons name="medical" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>Medical Info</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency Instructions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleSection}>
              <Ionicons name="information-circle" size={20} color="#EF4444" />
              <Text style={styles.cardTitle}>Emergency Instructions</Text>
            </View>
          </View>

          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>1</Text>
              <Text style={styles.instructionText}>
                Stay calm and assess your situation
              </Text>
            </View>
            
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>2</Text>
              <Text style={styles.instructionText}>
                Use the emergency alert button to notify contacts
              </Text>
            </View>
            
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>3</Text>
              <Text style={styles.instructionText}>
                Call emergency services if immediate help is needed
              </Text>
            </View>
            
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>4</Text>
              <Text style={styles.instructionText}>
                Share your location with trusted contacts
              </Text>
            </View>
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
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#FCA5A5',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    padding: 20,
    paddingTop: 25,
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  emergencyButtonContent: {
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  emergencyButtonSubtext: {
    color: '#FCA5A5',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
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
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  locationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  locationButtonText: {
    color: '#3B82F6',
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
  },
  contactCount: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  contactsList: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  contactNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  callButton: {
    backgroundColor: '#10B981',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addContactText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
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
  instructionsList: {
    gap: 12,
    marginTop: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  instructionNumber: {
    backgroundColor: '#EF4444',
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
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});