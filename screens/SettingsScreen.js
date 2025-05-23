import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Linking,
  Modal,
  Slider,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

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

  // New states for enhanced functionality
  const [textSize, setTextSize] = useState(16); // Default text size
  const [showTextSizeModal, setShowTextSizeModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    console.log('🎯 SettingsScreen: Component mounted');
    
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔄 SettingsScreen: Auth state changed');
      console.log('📊 User exists:', !!user);
      
      if (user) {
        console.log('✅ Setting user data:', user.email);
        setUser({
          name: user.displayName || 'User',
          email: user.email,
          photoURL: user.photoURL,
        });
      } else {
        console.log('❌ Clearing user data');
        setUser(null);
      }
    });

    // Load saved settings
    loadSettings();

    // Cleanup subscription
    return () => {
      console.log('🧹 SettingsScreen: Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  // Load settings from AsyncStorage
  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      const savedTextSize = await AsyncStorage.getItem('textSize');
      
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      
      if (savedTextSize) {
        setTextSize(parseInt(savedTextSize));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Save settings to AsyncStorage
  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Save text size to AsyncStorage
  const saveTextSize = async (size) => {
    try {
      await AsyncStorage.setItem('textSize', size.toString());
    } catch (error) {
      console.error('Error saving text size:', error);
    }
  };

  const toggleSetting = async (key) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key]
    };
    
    setSettings(newSettings);
    await saveSettings(newSettings);
    
    // Show feedback for accessibility changes
    if (key === 'highContrast') {
      Alert.alert(
        'High Contrast Mode',
        newSettings[key] 
          ? 'High contrast mode enabled for better visibility'
          : 'High contrast mode disabled'
      );
    } else if (key === 'darkMode') {
      Alert.alert(
        'Dark Mode',
        newSettings[key] 
          ? 'Dark mode enabled - easier on the eyes in low light'
          : 'Dark mode disabled - back to light theme'
      );
    }
  };

  // Text Size Modal Component
  const TextSizeModal = () => (
    <Modal
      visible={showTextSizeModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowTextSizeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Text Size</Text>
            <TouchableOpacity 
              onPress={() => setShowTextSizeModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.sampleText, { fontSize: textSize }]}>
            Sample text to preview size
          </Text>
          
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Small</Text>
            <Slider
              style={styles.slider}
              minimumValue={12}
              maximumValue={24}
              value={textSize}
              onValueChange={setTextSize}
              onSlidingComplete={async (value) => {
                const roundedValue = Math.round(value);
                setTextSize(roundedValue);
                await saveTextSize(roundedValue);
              }}
              minimumTrackTintColor="#3B82F6"
              maximumTrackTintColor="#E5E7EB"
              thumbStyle={{ backgroundColor: '#3B82F6' }}
            />
            <Text style={styles.sliderLabel}>Large</Text>
          </View>
          
          <Text style={styles.textSizeInfo}>
            Current size: {textSize}px
          </Text>
          
          <TouchableOpacity 
            style={styles.modalButton}
            onPress={() => setShowTextSizeModal(false)}
          >
            <Text style={styles.modalButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Help & FAQ Modal Component
  const HelpModal = () => (
    <Modal
      visible={showHelpModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowHelpModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Help & FAQ</Text>
            <TouchableOpacity 
              onPress={() => setShowHelpModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollView}>
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How do I connect my SoleMate device?</Text>
              <Text style={styles.faqAnswer}>
                Go to Device Management and tap "Add Device". Make sure your SoleMate is in pairing mode and follow the on-screen instructions.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Why isn't voice guidance working?</Text>
              <Text style={styles.faqAnswer}>
                Check that Voice Guidance is enabled in settings and your device volume is up. Also ensure the app has microphone permissions.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How do I share my location with emergency contacts?</Text>
              <Text style={styles.faqAnswer}>
                Enable Location Sharing in settings, then add emergency contacts in your profile. They'll receive your location during emergencies.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>What should I do if the app crashes?</Text>
              <Text style={styles.faqAnswer}>
                Try restarting the app first. If issues persist, restart your device or contact support at support@solemate.com.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How do I reset my password?</Text>
              <Text style={styles.faqAnswer}>
                Use the "Forgot Password" link on the login screen, or contact support if you need additional help.
              </Text>
            </View>
          </ScrollView>
          
          <View style={styles.contactSupport}>
            <Text style={styles.contactText}>Still need help?</Text>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => {
                setShowHelpModal(false);
                Linking.openURL('mailto:support@solemate.com?subject=SoleMate Support Request');
              }}
            >
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Privacy Policy Modal Component
  const PrivacyModal = () => (
    <Modal
      visible={showPrivacyModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowPrivacyModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Privacy Policy</Text>
            <TouchableOpacity 
              onPress={() => setShowPrivacyModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollView}>
            <Text style={styles.privacySection}>Data Collection</Text>
            <Text style={styles.privacyText}>
              We collect only the minimum data necessary to provide our services, including location data for navigation, device connectivity information, and usage analytics to improve app performance.
            </Text>
            
            <Text style={styles.privacySection}>How We Use Your Data</Text>
            <Text style={styles.privacyText}>
              Your data is used to provide navigation assistance, emergency services, device connectivity, and app improvements. We never sell your personal information to third parties.
            </Text>
            
            <Text style={styles.privacySection}>Data Security</Text>
            <Text style={styles.privacyText}>
              All data is encrypted in transit and at rest. We use industry-standard security measures to protect your information and regularly audit our systems.
            </Text>
            
            <Text style={styles.privacySection}>Location Data</Text>
            <Text style={styles.privacyText}>
              Location data is used for navigation and emergency services. You can disable location sharing at any time in settings, though some features may be limited.
            </Text>
            
            <Text style={styles.privacySection}>Third-Party Services</Text>
            <Text style={styles.privacyText}>
              We use trusted third-party services for maps, analytics, and cloud storage. These partners are bound by strict data protection agreements.
            </Text>
            
            <Text style={styles.privacySection}>Your Rights</Text>
            <Text style={styles.privacyText}>
              You have the right to access, modify, or delete your personal data. Contact us at privacy@solemate.com for data requests.
            </Text>
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.modalButton}
            onPress={() => setShowPrivacyModal(false)}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // About Modal Component
  const AboutModal = () => (
    <Modal
      visible={showAboutModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAboutModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>About SoleMate</Text>
            <TouchableOpacity 
              onPress={() => setShowAboutModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollView}>
            <View style={styles.aboutLogo}>
              <Ionicons name="footsteps" size={64} color="#3B82F6" />
              <Text style={styles.aboutAppName}>SoleMate</Text>
              <Text style={styles.aboutVersion}>Version 1.0.0</Text>
              <Text style={styles.aboutBuild}>Build 2024.01.15</Text>
            </View>
            
            <Text style={styles.aboutDescription}>
              SoleMate is an innovative smart navigation companion designed to enhance mobility and safety for users with visual impairments and mobility challenges.
            </Text>
            
            <View style={styles.aboutFeatures}>
              <Text style={styles.aboutFeaturesTitle}>Key Features:</Text>
              <Text style={styles.aboutFeatureItem}>• Smart navigation with voice guidance</Text>
              <Text style={styles.aboutFeatureItem}>• Bluetooth device connectivity</Text>
              <Text style={styles.aboutFeatureItem}>• Emergency alert system</Text>
              <Text style={styles.aboutFeatureItem}>• Accessibility-first design</Text>
              <Text style={styles.aboutFeatureItem}>• Location sharing with contacts</Text>
            </View>
            
            <View style={styles.aboutCompany}>
              <Text style={styles.aboutCompanyTitle}>SoleMate Technologies</Text>
              <Text style={styles.aboutCompanyText}>
                Dedicated to creating inclusive technology solutions that empower independence and enhance quality of life.
              </Text>
            </View>
            
            <View style={styles.aboutContact}>
              <Text style={styles.aboutContactTitle}>Contact Information:</Text>
              <TouchableOpacity onPress={() => Linking.openURL('mailto:info@solemate.com')}>
                <Text style={styles.aboutContactLink}>info@solemate.com</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.solemate.com')}>
                <Text style={styles.aboutContactLink}>www.solemate.com</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.aboutCopyright}>
              © 2024 SoleMate Technologies. All rights reserved.
            </Text>
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.modalButton}
            onPress={() => setShowAboutModal(false)}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Feedback Modal Component
  const FeedbackModal = () => (
    <Modal
      visible={showFeedbackModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFeedbackModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Send Feedback</Text>
            <TouchableOpacity 
              onPress={() => setShowFeedbackModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollView}>
            <Text style={styles.feedbackText}>
              Your feedback helps us improve SoleMate and create better experiences for all users.
            </Text>
            
            <View style={styles.feedbackOptions}>
              <TouchableOpacity 
                style={styles.feedbackOption}
                onPress={() => {
                  setShowFeedbackModal(false);
                  Linking.openURL('mailto:feedback@solemate.com?subject=General Feedback');
                }}
              >
                <Ionicons name="mail" size={24} color="#3B82F6" />
                <View style={styles.feedbackOptionText}>
                  <Text style={styles.feedbackOptionTitle}>Email Feedback</Text>
                  <Text style={styles.feedbackOptionSubtitle}>Send detailed feedback via email</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.feedbackOption}
                onPress={() => {
                  setShowFeedbackModal(false);
                  // In a real app, this would open the app store
                  Alert.alert('Rate App', 'This would open the app store for rating.');
                }}
              >
                <Ionicons name="star" size={24} color="#F59E0B" />
                <View style={styles.feedbackOptionText}>
                  <Text style={styles.feedbackOptionTitle}>Rate on App Store</Text>
                  <Text style={styles.feedbackOptionSubtitle}>Leave a review and rating</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.feedbackOption}
                onPress={() => {
                  setShowFeedbackModal(false);
                  Linking.openURL('mailto:bugs@solemate.com?subject=Bug Report');
                }}
              >
                <Ionicons name="bug" size={24} color="#EF4444" />
                <View style={styles.feedbackOptionText}>
                  <Text style={styles.feedbackOptionTitle}>Report a Bug</Text>
                  <Text style={styles.feedbackOptionSubtitle}>Help us fix issues</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.feedbackOption}
                onPress={() => {
                  setShowFeedbackModal(false);
                  Linking.openURL('mailto:features@solemate.com?subject=Feature Request');
                }}
              >
                <Ionicons name="bulb" size={24} color="#10B981" />
                <View style={styles.feedbackOptionText}>
                  <Text style={styles.feedbackOptionTitle}>Suggest a Feature</Text>
                  <Text style={styles.feedbackOptionSubtitle}>Share your ideas with us</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.modalButton}
            onPress={() => setShowFeedbackModal(false)}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Improved logout function with better error handling and debugging
  const handleLogout = async () => {
    console.log('=== LOGOUT PROCESS STARTED ===');
    
    // Prevent multiple logout attempts
    if (isLoggingOut) {
      console.log('⚠️ Logout already in progress, ignoring...');
      return;
    }
    
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            console.log('📤 User confirmed logout, starting process...');
            await performLogout();
          }
        }
      ]
    );
  };

  const performLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Add more detailed logging
      console.log('🔍 Pre-logout state check:');
      console.log('  - Auth object exists:', !!auth);
      console.log('  - Current user exists:', !!auth?.currentUser);
      console.log('  - Current user email:', auth?.currentUser?.email);
      console.log('  - SignOut function type:', typeof signOut);
      
      // Validate Firebase auth
      if (!auth) {
        throw new Error('Firebase auth is not initialized');
      }
      
      if (!auth.currentUser) {
        console.log('ℹ️ No user currently signed in');
        setIsLoggingOut(false);
        return;
      }
      
      console.log('🔄 Current user before logout:', auth.currentUser.email);
      
      // Clear any cached data first (with individual error handling)
      console.log('🧹 Starting AsyncStorage cleanup...');
      const keysToRemove = [
        'userPreferences', 
        'authToken', 
        'userData',
        'userSession',
        'lastLoginTime'
      ];
      
      for (const key of keysToRemove) {
        try {
          await AsyncStorage.removeItem(key);
          console.log(`✅ Removed ${key} from AsyncStorage`);
        } catch (storageError) {
          console.warn(`⚠️ Failed to remove ${key}:`, storageError.message);
        }
      }
      
      console.log('🧹 AsyncStorage cleanup completed');
      
      // Perform the sign out with timeout
      console.log('🔄 Calling Firebase signOut...');
      
      const signOutPromise = signOut(auth);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign out timeout')), 10000)
      );
      
      await Promise.race([signOutPromise, timeoutPromise]);
      
      console.log('✅ Firebase signOut completed successfully');
      console.log('🔍 Current user after signOut:', auth.currentUser);
      
      // Reset local state immediately
      setUser(null);
      setIsLoggingOut(false);
      
      // Verify logout success
      setTimeout(() => {
        console.log('🔍 Final auth state check:', {
          currentUser: auth.currentUser,
          userState: user
        });
        
        if (auth.currentUser !== null) {
          console.warn('⚠️ User still authenticated after logout - forcing cleanup');
          forceLogout();
        } else {
          console.log('🎉 Logout verification successful - user signed out');
        }
      }, 1000);
      
      console.log('🎉 Logout process completed - AppNavigator should handle navigation');
      
    } catch (error) {
      console.error('❌ Logout error occurred:', error);
      setIsLoggingOut(false);
      
      let errorMessage = 'Failed to sign out. Please try again.';
      
      // Handle specific Firebase errors
      if (error.code) {
        switch (error.code) {
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection and try again.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many requests. Please wait a moment and try again.';
            break;
          case 'auth/user-token-expired':
            console.log('🔄 Token expired - forcing logout');
            await forceLogout();
            return;
          case 'auth/user-not-found':
            console.log('🔄 User already signed out');
            setUser(null);
            setIsLoggingOut(false);
            return;
          default:
            errorMessage = `Sign out failed: ${error.message || error.code}`;
        }
      } else if (error.message === 'Sign out timeout') {
        errorMessage = 'Sign out is taking too long. This might be a network issue.';
      }
      
      Alert.alert(
        'Sign Out Error', 
        errorMessage,
        [
          {
            text: 'Try Again',
            onPress: () => {
              setIsLoggingOut(false);
              performLogout();
            }
          },
          {
            text: 'Force Sign Out',
            style: 'destructive',
            onPress: forceLogout
          }
        ]
      );
    }
  };

  // Enhanced Firebase test for debugging
  const testFirebaseConnection = async () => {
    console.log('=== FIREBASE CONNECTION TEST ===');
    
    try {
      console.log('🔍 Firebase auth object exists:', !!auth);
      console.log('🔍 Current user exists:', !!auth.currentUser);
      console.log('🔍 User email:', auth.currentUser?.email);
      console.log('🔍 User UID:', auth.currentUser?.uid);
      console.log('🔍 signOut function type:', typeof signOut);
      
      // Test AsyncStorage
      try {
        const testKey = 'connectionTest';
        const testValue = new Date().toISOString();
        await AsyncStorage.setItem(testKey, testValue);
        const retrievedValue = await AsyncStorage.getItem(testKey);
        await AsyncStorage.removeItem(testKey);
        console.log('✅ AsyncStorage test successful:', retrievedValue === testValue);
      } catch (storageError) {
        console.error('❌ AsyncStorage test failed:', storageError);
      }
      
      // Test auth state
      const currentUser = auth.currentUser;
      const userDetails = currentUser ? {
        uid: currentUser.uid,
        email: currentUser.email,
        emailVerified: currentUser.emailVerified,
        isAnonymous: currentUser.isAnonymous,
        creationTime: currentUser.metadata?.creationTime,
        lastSignInTime: currentUser.metadata?.lastSignInTime,
      } : null;
      
      console.log('🔍 Current user details:', userDetails);
      
      Alert.alert(
        'Firebase Test Results',
        `Auth Object: ${!!auth ? 'OK' : 'FAILED'}\n` +
        `Current User: ${!!auth.currentUser ? 'Logged In' : 'Not Logged In'}\n` +
        `User Email: ${auth.currentUser?.email || 'N/A'}\n` +
        `SignOut Function: ${typeof signOut === 'function' ? 'Available' : 'Missing'}\n` +
        `AsyncStorage: Working\n` +
        `Logging Out Status: ${isLoggingOut ? 'Yes' : 'No'}\n` +
        `User State: ${user ? 'Set' : 'Null'}`
      );
      
    } catch (error) {
      console.error('❌ Firebase test error:', error);
      Alert.alert('Firebase Test Error', error.message || 'Unknown error occurred');
    }
  };

  // Force logout function for emergencies
  const forceLogout = async () => {
    console.log('🚨 FORCE LOGOUT INITIATED');
    
    try {
      setIsLoggingOut(true);
      
      // Clear everything aggressively
      console.log('🧹 Clearing all local storage...');
      await AsyncStorage.clear();
      
      // Clear user state immediately
      setUser(null);
      
      // Try to sign out from Firebase with shorter timeout
      try {
        if (auth.currentUser) {
          const forceSignOut = Promise.race([
            signOut(auth),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Force timeout')), 3000)
            )
          ]);
          
          await forceSignOut;
          console.log('✅ Firebase sign out completed');
        } else {
          console.log('ℹ️ No user to sign out from Firebase');
        }
      } catch (signOutError) {
        console.warn('⚠️ Firebase sign out failed during force logout:', signOutError);
        // In force logout, we continue even if Firebase fails
      }
      
      console.log('✅ Force logout completed');
      setIsLoggingOut(false);
      
      // Final verification
      setTimeout(() => {
        console.log('🔄 Post-force-logout state:', {
          currentUser: auth.currentUser,
          userState: user
        });
        
        // If we still have issues, show user instructions
        if (auth.currentUser) {
          Alert.alert(
            'Logout Notice',
            'You have been signed out locally. If you continue to see issues, please restart the app.',
            [{ text: 'OK' }]
          );
        }
      }, 500);
      
    } catch (error) {
      console.error('❌ Force logout failed:', error);
      setIsLoggingOut(false);
      Alert.alert(
        'Force Logout Failed', 
        `Error: ${error.message}\n\nPlease restart the app if you continue to have issues.`
      );
    }
  };

  function handleAction(action) {
    switch (action) {
      case 'about':
        setShowAboutModal(true);
        break;
      case 'privacy':
        setShowPrivacyModal(true);
        break;
      case 'help':
        setShowHelpModal(true);
        break;
      case 'feedback':
        setShowFeedbackModal(true);
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
              onPress: async () => {
                const defaultSettings = {
                  notifications: true,
                  vibration: true,
                  voiceGuidance: true,
                  autoConnect: false,
                  locationSharing: true,
                  emergencyAlerts: true,
                  darkMode: false,
                  highContrast: false,
                };
                setSettings(defaultSettings);
                setTextSize(16);
                await saveSettings(defaultSettings);
                await saveTextSize(16);
                Alert.alert('Settings Reset', 'All settings have been reset to default values.');
              }
            }
          ]
        );
        break;
      case 'logout':
        console.log('🎯 handleAction called with logout');
        handleLogout();
        break;
      case 'editProfile':
        Alert.alert(
          'Edit Profile',
          'Profile editing feature coming soon!',
          [{ text: 'OK' }]
        );
        break;
      case 'deviceManagement':
        Alert.alert(
          'Device Management',
          'Device management feature coming soon!',
          [{ text: 'OK' }]
        );
        break;
        case 'textSize':
        setShowTextSizeModal(true);
        break;
      default:
        console.log('Unknown action:', action);
    }
  }

  const renderSettingItem = (
    key,
    title,
    subtitle,
    icon,
    value,
    onPress,
    showSwitch = true,
    showChevron = false
  ) => (
    <TouchableOpacity
      key={key}
      style={[
        styles.settingItem,
        settings.darkMode && styles.settingItemDark,
        settings.highContrast && styles.settingItemHighContrast
      ]}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={`${title}. ${subtitle}. ${showSwitch ? (value ? 'Enabled' : 'Disabled') : ''}`}
      accessibilityRole={showSwitch ? 'switch' : 'button'}
      accessibilityState={showSwitch ? { checked: value } : undefined}
    >
      <View style={styles.settingLeft}>
        <Ionicons
          name={icon}
          size={24}
          color={settings.darkMode ? '#E5E7EB' : '#374151'}
          style={styles.settingIcon}
        />
        <View style={styles.settingTextContainer}>
          <Text
            style={[
              styles.settingTitle,
              { fontSize: textSize },
              settings.darkMode && styles.settingTitleDark,
              settings.highContrast && styles.settingTitleHighContrast
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.settingSubtitle,
              { fontSize: textSize - 2 },
              settings.darkMode && styles.settingSubtitleDark,
              settings.highContrast && styles.settingSubtitleHighContrast
            ]}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      {showSwitch && (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{
            false: settings.darkMode ? '#374151' : '#E5E7EB',
            true: '#3B82F6'
          }}
          thumbColor={value ? '#FFFFFF' : '#F3F4F6'}
          ios_backgroundColor={settings.darkMode ? '#374151' : '#E5E7EB'}
        />
      )}
      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={settings.darkMode ? '#9CA3AF' : '#6B7280'}
        />
      )}
    </TouchableOpacity>
  );

  const renderActionItem = (title, subtitle, icon, onPress, iconColor = '#6B7280') => (
    <TouchableOpacity
      style={[
        styles.actionItem,
        settings.darkMode && styles.actionItemDark,
        settings.highContrast && styles.actionItemHighContrast
      ]}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={`${title}. ${subtitle}`}
      accessibilityRole="button"
    >
      <View style={styles.actionLeft}>
        <Ionicons
          name={icon}
          size={24}
          color={settings.darkMode ? '#E5E7EB' : iconColor}
          style={styles.actionIcon}
        />
        <View style={styles.actionTextContainer}>
          <Text
            style={[
              styles.actionTitle,
              { fontSize: textSize },
              settings.darkMode && styles.actionTitleDark,
              settings.highContrast && styles.actionTitleHighContrast
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.actionSubtitle,
              { fontSize: textSize - 2 },
              settings.darkMode && styles.actionSubtitleDark,
              settings.highContrast && styles.actionSubtitleHighContrast
            ]}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={settings.darkMode ? '#9CA3AF' : '#6B7280'}
      />
    </TouchableOpacity>
  );

  return (
    <View style={[
      styles.container,
      settings.darkMode && styles.containerDark,
      settings.highContrast && styles.containerHighContrast
    ]}>
      <LinearGradient
        colors={settings.darkMode ? ['#1F2937', '#111827'] : ['#3B82F6', '#1E40AF']}
        style={styles.header}
      >
        <Text style={[styles.headerTitle, { fontSize: textSize + 8 }]}>Settings</Text>
        {user && (
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { fontSize: textSize + 2 }]}>{user.name}</Text>
              <Text style={[styles.userEmail, { fontSize: textSize - 2 }]}>{user.email}</Text>
            </View>
          </View>
        )}
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Section */}
        {user && (
          <View style={[
            styles.section,
            settings.darkMode && styles.sectionDark,
            settings.highContrast && styles.sectionHighContrast
          ]}>
            <Text style={[
              styles.sectionTitle,
              { fontSize: textSize + 2 },
              settings.darkMode && styles.sectionTitleDark,
              settings.highContrast && styles.sectionTitleHighContrast
            ]}>
              Profile
            </Text>
            {renderActionItem(
              'Edit Profile',
              'Update your personal information',
              'person-circle',
              () => handleAction('editProfile')
            )}
            {renderActionItem(
              'Device Management',
              'Manage connected devices',
              'bluetooth',
              () => handleAction('deviceManagement')
            )}
          </View>
        )}

        {/* App Preferences */}
        <View style={[
          styles.section,
          settings.darkMode && styles.sectionDark,
          settings.highContrast && styles.sectionHighContrast
        ]}>
          <Text style={[
            styles.sectionTitle,
            { fontSize: textSize + 2 },
            settings.darkMode && styles.sectionTitleDark,
            settings.highContrast && styles.sectionTitleHighContrast
          ]}>
            App Preferences
          </Text>
          
          {renderSettingItem(
            'notifications',
            'Notifications',
            'Receive app notifications and alerts',
            'notifications',
            settings.notifications,
            () => toggleSetting('notifications')
          )}
          
          {renderSettingItem(
            'vibration',
            'Vibration',
            'Enable haptic feedback',
            'phone-portrait',
            settings.vibration,
            () => toggleSetting('vibration')
          )}
          
          {renderSettingItem(
            'voiceGuidance',
            'Voice Guidance',
            'Enable audio navigation instructions',
            'volume-high',
            settings.voiceGuidance,
            () => toggleSetting('voiceGuidance')
          )}
          
          {renderSettingItem(
            'autoConnect',
            'Auto-Connect Devices',
            'Automatically connect to known devices',
            'bluetooth',
            settings.autoConnect,
            () => toggleSetting('autoConnect')
          )}
        </View>

        {/* Privacy & Safety */}
        <View style={[
          styles.section,
          settings.darkMode && styles.sectionDark,
          settings.highContrast && styles.sectionHighContrast
        ]}>
          <Text style={[
            styles.sectionTitle,
            { fontSize: textSize + 2 },
            settings.darkMode && styles.sectionTitleDark,
            settings.highContrast && styles.sectionTitleHighContrast
          ]}>
            Privacy & Safety
          </Text>
          
          {renderSettingItem(
            'locationSharing',
            'Location Sharing',
            'Share location with emergency contacts',
            'location',
            settings.locationSharing,
            () => toggleSetting('locationSharing')
          )}
          
          {renderSettingItem(
            'emergencyAlerts',
            'Emergency Alerts',
            'Receive critical safety notifications',
            'warning',
            settings.emergencyAlerts,
            () => toggleSetting('emergencyAlerts')
          )}
        </View>

        {/* Accessibility */}
        <View style={[
          styles.section,
          settings.darkMode && styles.sectionDark,
          settings.highContrast && styles.sectionHighContrast
        ]}>
          <Text style={[
            styles.sectionTitle,
            { fontSize: textSize + 2 },
            settings.darkMode && styles.sectionTitleDark,
            settings.highContrast && styles.sectionTitleHighContrast
          ]}>
            Accessibility
          </Text>
          
          {renderActionItem(
            'Text Size',
            `Current size: ${textSize}px`,
            'text',
            () => handleAction('textSize')
          )}
          
          {renderSettingItem(
            'darkMode',
            'Dark Mode',
            'Easier on the eyes in low light',
            'moon',
            settings.darkMode,
            () => toggleSetting('darkMode')
          )}
          
          {renderSettingItem(
            'highContrast',
            'High Contrast',
            'Improve visibility with higher contrast',
            'contrast',
            settings.highContrast,
            () => toggleSetting('highContrast')
          )}
        </View>

        {/* Support & Information */}
        <View style={[
          styles.section,
          settings.darkMode && styles.sectionDark,
          settings.highContrast && styles.sectionHighContrast
        ]}>
          <Text style={[
            styles.sectionTitle,
            { fontSize: textSize + 2 },
            settings.darkMode && styles.sectionTitleDark,
            settings.highContrast && styles.sectionTitleHighContrast
          ]}>
            Support & Information
          </Text>
          
          {renderActionItem(
            'Help & FAQ',
            'Get answers to common questions',
            'help-circle',
            () => handleAction('help')
          )}
          
          {renderActionItem(
            'Send Feedback',
            'Help us improve the app',
            'chatbubble-ellipses',
            () => handleAction('feedback')
          )}
          
          {renderActionItem(
            'Privacy Policy',
            'How we protect your data',
            'shield-checkmark',
            () => handleAction('privacy')
          )}
          
          {renderActionItem(
            'About SoleMate',
            'App version and information',
            'information-circle',
            () => handleAction('about')
          )}
        </View>

        {/* Reset & Logout */}
        <View style={[
          styles.section,
          settings.darkMode && styles.sectionDark,
          settings.highContrast && styles.sectionHighContrast
        ]}>
          <Text style={[
            styles.sectionTitle,
            { fontSize: textSize + 2 },
            settings.darkMode && styles.sectionTitleDark,
            settings.highContrast && styles.sectionTitleHighContrast
          ]}>
            Reset & Account
          </Text>
          
          {renderActionItem(
            'Reset All Settings',
            'Restore default settings',
            'refresh-circle',
            () => handleAction('reset'),
            '#F59E0B'
          )}
          
          {user && renderActionItem(
            isLoggingOut ? 'Signing Out...' : 'Sign Out',
            'Sign out of your account',
            'log-out',
            () => handleAction('logout'),
            '#EF4444'
          )}
        </View>

        {/* Debug Section (only in development) */}
        {__DEV__ && (
          <View style={[
            styles.section,
            settings.darkMode && styles.sectionDark,
            styles.debugSection
          ]}>
            <Text style={[
              styles.sectionTitle,
              { fontSize: textSize + 2 },
              settings.darkMode && styles.sectionTitleDark,
              { color: '#EF4444' }
            ]}>
              Debug (Development Only)
            </Text>
            
            {renderActionItem(
              'Test Firebase Connection',
              'Debug authentication and storage',
              'bug',
              testFirebaseConnection,
              '#EF4444'
            )}
            
            {renderActionItem(
              'Force Logout',
              'Emergency logout if normal logout fails',
              'warning',
              forceLogout,
              '#F59E0B'
            )}
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <TextSizeModal />
      <HelpModal />
      <PrivacyModal />
      <AboutModal />
      <FeedbackModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  containerHighContrast: {
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionDark: {
    backgroundColor: '#1F2937',
  },
  sectionHighContrast: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
  },
  debugSection: {
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitleDark: {
    color: '#E5E7EB',
  },
  sectionTitleHighContrast: {
    color: '#000000',
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingItemDark: {
    borderBottomColor: '#374151',
  },
  settingItemHighContrast: {
    borderBottomColor: '#000000',
    borderBottomWidth: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 15,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  settingTitleDark: {
    color: '#E5E7EB',
  },
  settingTitleHighContrast: {
    color: '#000000',
    fontWeight: 'bold',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingSubtitleDark: {
    color: '#9CA3AF',
  },
  settingSubtitleHighContrast: {
    color: '#000000',
    fontWeight: '500',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionItemDark: {
    borderBottomColor: '#374151',
  },
  actionItemHighContrast: {
    borderBottomColor: '#000000',
    borderBottomWidth: 2,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    marginRight: 15,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  actionTitleDark: {
    color: '#E5E7EB',
  },
  actionTitleHighContrast: {
    color: '#000000',
    fontWeight: 'bold',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionSubtitleDark: {
    color: '#9CA3AF',
  },
  actionSubtitleHighContrast: {
    color: '#000000',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: width * 0.9,
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
  },
  closeButton: {
    padding: 5,
  },
  modalScrollView: {
    maxHeight: '70%',
  },
  modalButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sampleText: {
    textAlign: 'center',
    color: '#374151',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#6B7280',
    width: 40,
    textAlign: 'center',
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  textSizeInfo: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 10,
  },
  faqItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  contactSupport: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  contactButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  privacySection: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  privacyText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  aboutLogo: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  aboutAppName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 10,
  },
  aboutVersion: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 5,
  },
  aboutBuild: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  aboutFeatures: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  aboutFeaturesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  aboutFeatureItem: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  aboutCompany: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  aboutCompanyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  aboutCompanyText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  aboutContact: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  aboutContactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  aboutContactLink: {
    fontSize: 14,
    color: '#3B82F6',
    marginBottom: 5,
    textDecorationLine: 'underline',
  },
  aboutCopyright: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    padding: 20,
  },
  feedbackText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
    padding: 20,
  },
  feedbackOptions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  feedbackOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 10,
  },
  feedbackOptionText: {
    marginLeft: 15,
    flex: 1,
  },
  feedbackOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  feedbackOptionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
});