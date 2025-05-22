import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    vibration: true,
    voiceGuidance: true,
    autoConnect: false,
    locationSharing: true,
    emergencyAlerts: true,
    darkMode: false,
    highContrast: false,
  });

  const toggleSetting = (key) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: !prevSettings[key]
    }));
  };

  const handleAction = (action) => {
    switch (action) {
      case 'about':
        Alert.alert(
          'About SoleMate',
          'SoleMate v1.0.0\nSmart navigation companion for enhanced mobility and safety.\n\n© 2024 SoleMate Technologies'
        );
        break;
      case 'privacy':
        Alert.alert(
          'Privacy Policy',
          'Your privacy is important to us. We collect minimal data necessary for app functionality and never share personal information without consent.'
        );
        break;
      case 'help':
        Alert.alert(
          'Help & Support',
          'Need assistance? Visit our support center or contact us at support@solemate.com'
        );
        break;
      case 'feedback':
        Alert.alert(
          'Send Feedback',
          'Your feedback helps us improve. Please rate us on the app store or send us your suggestions.'
        );
        break;
      case 'reset':
        Alert.alert(
          'Reset All Settings',
          'This will reset all settings to their default values. Are you sure?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Reset',
              style: 'destructive',
              onPress: () => {
                setSettings({
                  notifications: true,
                  vibration: true,
                  voiceGuidance: true,
                  autoConnect: false,
                  locationSharing: true,
                  emergencyAlerts: true,
                  darkMode: false,
                  highContrast: false,
                });
                Alert.alert('Settings Reset', 'All settings have been reset to default values.');
              }
            }
          ]
        );
        break;
      case 'logout':
        Alert.alert(
          'Sign Out',
          'Are you sure you want to sign out of your account?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Sign Out',
              style: 'destructive',
              onPress: () => {
                Alert.alert('Signed Out', 'You have been signed out successfully.');
              }
            }
          ]
        );
        break;
    }
  };

  const SettingItem = ({ icon, title, subtitle, value, onToggle, type = 'switch' }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={20} color="#3B82F6" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
          thumbColor={value ? '#3B82F6' : '#9CA3AF'}
        />
      )}
      
      {type === 'arrow' && (
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      )}
    </View>
  );

  const ActionItem = ({ icon, title, subtitle, onPress, color = '#3B82F6', dangerous = false }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, dangerous && { backgroundColor: '#FEF2F2' }]}>
          <Ionicons name={icon} size={20} color={dangerous ? '#EF4444' : color} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, dangerous && { color: '#EF4444' }]}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#3B82F6', '#1E40AF']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="settings" size={32} color="#FFFFFF" />
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your SoleMate experience</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* User Profile Section */}
        <View style={styles.card}>
          <View style={styles.profileSection}>
            <View style={styles.profileAvatar}>
              <Ionicons name="person" size={32} color="#FFFFFF" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@example.com</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications & Alerts */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notifications & Alerts</Text>
          
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Receive app notifications"
            value={settings.notifications}
            onToggle={() => toggleSetting('notifications')}
          />
          
          <SettingItem
            icon="phone-portrait"
            title="Vibration"
            subtitle="Vibrate for alerts and notifications"
            value={settings.vibration}
            onToggle={() => toggleSetting('vibration')}
          />
          
          <SettingItem
            icon="warning"
            title="Emergency Alerts"
            subtitle="Critical safety notifications"
            value={settings.emergencyAlerts}
            onToggle={() => toggleSetting('emergencyAlerts')}
          />
        </View>

        {/* Navigation & Voice */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Navigation & Voice</Text>
          
          <SettingItem
            icon="volume-high"
            title="Voice Guidance"
            subtitle="Audio navigation instructions"
            value={settings.voiceGuidance}
            onToggle={() => toggleSetting('voiceGuidance')}
          />
          
          <SettingItem
            icon="location"
            title="Location Sharing"
            subtitle="Share location with emergency contacts"
            value={settings.locationSharing}
            onToggle={() => toggleSetting('locationSharing')}
          />
        </View>

        {/* Device & Connection */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Device & Connection</Text>
          
          <SettingItem
            icon="bluetooth"
            title="Auto-Connect"
            subtitle="Automatically connect to SoleMate device"
            value={settings.autoConnect}
            onToggle={() => toggleSetting('autoConnect')}
          />
          
          <ActionItem
            icon="hardware-chip"
            title="Device Management"
            subtitle="Manage connected devices"
            onPress={() => Alert.alert('Device Management', 'Navigate to device settings')}
          />
        </View>

        {/* Accessibility */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Accessibility</Text>
          
          <SettingItem
            icon="moon"
            title="Dark Mode"
            subtitle="Use dark theme"
            value={settings.darkMode}
            onToggle={() => toggleSetting('darkMode')}
          />
          
          <SettingItem
            icon="contrast"
            title="High Contrast"
            subtitle="Increase text and button contrast"
            value={settings.highContrast}
            onToggle={() => toggleSetting('highContrast')}
          />
          
          <ActionItem
            icon="text"
            title="Text Size"
            subtitle="Adjust text size preferences"
            onPress={() => Alert.alert('Text Size', 'Adjust text size settings')}
          />
        </View>

        {/* Support & Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Support & Information</Text>
          
          <ActionItem
            icon="help-circle"
            title="Help & FAQ"
            subtitle="Get help and find answers"
            onPress={() => handleAction('help')}
          />
          
          <ActionItem
            icon="chatbubble-ellipses"
            title="Send Feedback"
            subtitle="Help us improve the app"
            onPress={() => handleAction('feedback')}
          />
          
          <ActionItem
            icon="shield-checkmark"
            title="Privacy Policy"
            subtitle="How we protect your data"
            onPress={() => handleAction('privacy')}
          />
          
          <ActionItem
            icon="information-circle"
            title="About SoleMate"
            subtitle="Version and app information"
            onPress={() => handleAction('about')}
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.card}>
          <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>Advanced</Text>
          
          <ActionItem
            icon="refresh"
            title="Reset Settings"
            subtitle="Reset all settings to default"
            onPress={() => handleAction('reset')}
            dangerous={true}
          />
          
          <ActionItem
            icon="log-out"
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={() => handleAction('logout')}
            dangerous={true}
          />
        </View>

        {/* App Version */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>SoleMate Version 1.0.0</Text>
          <Text style={styles.buildText}>Build 2024.01.15</Text>
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
    color: '#BFDBFE',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 40,
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  buildText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});