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
import styles from "../styles/SettingsStyles"
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
  });

  const [textSize, setTextSize] = useState(16);
  const [showTextSizeModal, setShowTextSizeModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user.displayName || 'User',
          email: user.email,
          photoURL: user.photoURL,
        });
      } else {
        setUser(null);
      }
    });

    loadSettings();
    return () => unsubscribe();
  }, []);

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

  const handleAction = (action) => {
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
      
      case 'deviceManagement':
        Alert.alert('Device Management', 'Device management feature coming soon!');
        break;
      case 'logout':
        forceLogout();
        default:
        console.log('Unknown action:', action);
    }
  };

  

  // Help Modal Component
  const HelpModal = () => (
    <Modal
      visible={showHelpModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowHelpModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Help & FAQ</Text>
              <TouchableOpacity 
                onPress={() => setShowHelpModal(false)}
                style={styles.closeButton}
              >
                <View style={styles.closeIconContainer}>
                  <Ionicons name="close" size={20} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>How do I connect my device?</Text>
                <Text style={styles.faqAnswer}>
                  Go to Device Management and tap "Add Device". Make sure your device is in pairing mode.
                </Text>
              </View>
              
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Why isn't voice guidance working?</Text>
                <Text style={styles.faqAnswer}>
                  Check that Voice Guidance is enabled in settings and your device volume is up.
                </Text>
              </View>
              
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>How do I share my location?</Text>
                <Text style={styles.faqAnswer}>
                  Enable Location Sharing in settings, then add emergency contacts in your profile.
                </Text>
              </View>
            </ScrollView>
            
            <View style={styles.contactSupport}>
              <Text style={styles.contactText}>Still need help?</Text>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => {
                  setShowHelpModal(false);
                  Linking.openURL('mailto:support@example.com?subject=Support Request');
                }}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                  style={styles.contactButtonGradient}
                >
                  <Text style={styles.contactButtonText}>Contact Support</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
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
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
              <TouchableOpacity 
                onPress={() => setShowPrivacyModal(false)}
                style={styles.closeButton}
              >
                <View style={styles.closeIconContainer}>
                  <Ionicons name="close" size={20} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              <Text style={styles.privacySectionTitle}>Data Collection</Text>
              <Text style={styles.privacyText}>
                We collect only the minimum data necessary to provide our services.
              </Text>
              
              <Text style={styles.privacySectionTitle}>How We Use Your Data</Text>
              <Text style={styles.privacyText}>
                Your data is used to provide navigation assistance and emergency services.
              </Text>
              
              <Text style={styles.privacySectionTitle}>Data Security</Text>
              <Text style={styles.privacyText}>
                All data is encrypted in transit and at rest.
              </Text>
            </ScrollView>
          </LinearGradient>
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
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About App</Text>
              <TouchableOpacity 
                onPress={() => setShowAboutModal(false)}
                style={styles.closeButton}
              >
                <View style={styles.closeIconContainer}>
                  <Ionicons name="close" size={20} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.aboutHeader}>
                <LinearGradient colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']} style={styles.aboutIconContainer}>
                  <Ionicons name="settings" size={32} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.aboutAppName}>Settings</Text>
                <Text style={styles.aboutVersion}>Version 1.0.0</Text>
              </View>
              
              <Text style={styles.aboutDescription}>
                This is the settings screen for the application.
              </Text>
              
              <View style={styles.aboutContact}>
                <Text style={styles.aboutContactTitle}>Contact:</Text>
                <TouchableOpacity onPress={() => Linking.openURL('mailto:info@example.com')}>
                  <Text style={styles.aboutContactLink}>info@example.com</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
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
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Feedback</Text>
              <TouchableOpacity 
                onPress={() => setShowFeedbackModal(false)}
                style={styles.closeButton}
              >
                <View style={styles.closeIconContainer}>
                  <Ionicons name="close" size={20} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              <Text style={styles.feedbackDescription}>
                Your feedback helps us improve the app.
              </Text>
              
              <View style={styles.feedbackOptions}>
                <TouchableOpacity 
                  style={styles.feedbackOption}
                  onPress={() => {
                    setShowFeedbackModal(false);
                    Linking.openURL('mailto:feedback@example.com?subject=General Feedback');
                  }}
                >
                  <Ionicons name="mail" size={24} color="#fff" />
                  <View style={styles.feedbackOptionText}>
                    <Text style={styles.feedbackOptionTitle}>Email Feedback</Text>
                    <Text style={styles.feedbackOptionSubtitle}>Send detailed feedback</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.feedbackOption}
                  onPress={() => {
                    setShowFeedbackModal(false);
                    Alert.alert('Rate App', 'This would open the app store for rating.');
                  }}
                >
                  <Ionicons name="star" size={24} color="#fff" />
                  <View style={styles.feedbackOptionText}>
                    <Text style={styles.feedbackOptionTitle}>Rate on App Store</Text>
                    <Text style={styles.feedbackOptionSubtitle}>Leave a review</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );

  
  const renderActionItem = (title, subtitle, icon, onPress, iconColor = 'rgba(255, 255, 255, 0.2)') => (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={onPress}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']}
          style={styles.actionCard}
        >
          <View style={styles.actionLeft}>
            <LinearGradient
              colors={[iconColor, iconColor + '80']}
              style={styles.actionIconContainer}
            >
              <Ionicons name={icon} size={20} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.actionTextContainer}>
              <Text style={[styles.actionTitle, { fontSize: textSize }]}>{title}</Text>
              <Text style={[styles.actionSubtitle, { fontSize: textSize - 2 }]}>{subtitle}</Text>
            </View>
          </View>
          <View style={styles.chevronContainer}>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      {/* Background Elements */}
      <View style={styles.backgroundElements}>
        <View style={[styles.floatingElement, styles.element1]} />
        <View style={[styles.floatingElement, styles.element2]} />
        <View style={[styles.floatingElement, styles.element3]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']}
          style={styles.headerGradient}
        >
          <View style={styles.statusBar}>
            <View style={styles.appTitle}>
              <View style={styles.logoIconContainer}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                  style={styles.logoGradient}
                >
                  <Ionicons name="settings" size={20} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.appTitleText}>Settings</Text>
                <View style={[styles.statusDot, { backgroundColor: '#4ADE80' }]} />
              </View>
            </View>
          </View>

          {user && (
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>{user.name}</Text>
              <Text style={styles.welcomeSubtitle}>{user.email}</Text>
            </View>
          )}
        </LinearGradient>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Device Management */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: textSize + 4 }]}>Device</Text>
          
          {renderActionItem(
            'Device Management',
            'Manage connected devices',
            'bluetooth',
            () => handleAction('deviceManagement'),
            'rgba(16, 185, 129, 0.2)'
          )}
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: textSize + 4 }]}>Support</Text>
          
          {renderActionItem(
            'Help & FAQ',
            'Get answers to common questions',
            'help-circle',
            () => handleAction('help'),
            'rgba(99, 102, 241, 0.2)'
          )}
          
          {renderActionItem(
            'Send Feedback',
            'Help us improve the app',
            'chatbubble-ellipses',
            () => handleAction('feedback'),
            'rgba(139, 92, 246, 0.2)'
          )}
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: textSize + 4 }]}>Legal</Text>
          
          {renderActionItem(
            'Privacy Policy',
            'How we protect your data',
            'shield-checkmark',
            () => handleAction('privacy'),
            'rgba(5, 150, 105, 0.2)'
          )}
          
          {renderActionItem(
            'About App',
            'App version and information',
            'information-circle',
            () => handleAction('about'),
            'rgba(8, 145, 178, 0.2)'
          )}
        </View>

        {/* Account */}
        {user && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: textSize + 4 }]}>Account</Text>
            
            {renderActionItem(
              isLoggingOut ? 'Signing Out...' : 'Sign Out',
              'Sign out of your account',
              'log-out',
              () => handleAction('logout'),
              'rgba(239, 68, 68, 0.2)'
            )}
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <HelpModal />
      <PrivacyModal />
      <AboutModal />
      <FeedbackModal />
    </LinearGradient>
  );
}

