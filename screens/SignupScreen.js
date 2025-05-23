// screens/SignupScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import styles from '../styles/SignupStyles';
const { width, height } = Dimensions.get('window');

export default function SignupScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Hover animation values
  const googleButtonScale = useRef(new Animated.Value(1)).current;
  const signupButtonScale = useRef(new Animated.Value(1)).current;
  const loginButtonScale = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const nameInputScale = useRef(new Animated.Value(1)).current;
  const emailInputScale = useRef(new Animated.Value(1)).current;
  const passwordInputScale = useRef(new Animated.Value(1)).current;
  const confirmPasswordInputScale = useRef(new Animated.Value(1)).current;
  const eyeIconScale = useRef(new Animated.Value(1)).current;
  const eyeIcon2Scale = useRef(new Animated.Value(1)).current;

  // Input focus animations
  const nameFocusAnim = useRef(new Animated.Value(0)).current;
  const emailFocusAnim = useRef(new Animated.Value(0)).current;
  const passwordFocusAnim = useRef(new Animated.Value(0)).current;
  const confirmPasswordFocusAnim = useRef(new Animated.Value(0)).current;

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
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation for features
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
  }, []);

  // Hover animation functions
  const createHoverAnimation = (animValue, toValue = 1.05, duration = 150) => ({
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

  const createInputFocusAnimation = (focusAnim) => ({
    onFocus: () => {
      Animated.timing(focusAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    },
    onBlur: () => {
      Animated.timing(focusAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    },
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Missing Information', 'Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Missing Information', 'Please enter your email address');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      Alert.alert('Missing Information', 'Please enter a password');
      return false;
    }
    if (!formData.confirmPassword) {
      Alert.alert('Missing Information', 'Please confirm your password');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    console.log('Attempting signup with:', formData.email);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, { 
        displayName: formData.name.trim() 
      });

      // Create user document in Firestore
      const userData = {
        uid: user.uid,
        email: formData.email.trim(),
        displayName: formData.name.trim(),
        provider: 'email',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        isActive: true,
        profileComplete: false,
        preferences: {
          voiceGuidance: true,
          hapticFeedback: true,
          emergencyContacts: [],
          language: 'en',
        },
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      console.log('✅ Account created successfully');

      Alert.alert(
        'Welcome to SoLMate!', 
        'Your account has been created successfully!',
        [
          {
            text: 'Get Started',
            onPress: () => {
              setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              // Navigation will be handled by auth state listener
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Signup Error:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('Google signup successful:', user.email);

      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: 'google',
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          isActive: true,
          profileComplete: false,
          preferences: {
            voiceGuidance: true,
            hapticFeedback: true,
            emergencyContacts: [],
            language: 'en',
          },
        });
        console.log('New Google user document created');
      }
    } catch (error) {
      console.error('Google sign-up error:', error);
      handleAuthError(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAuthError = (error) => {
    let errorMessage = 'Account creation failed. Please try again.';

    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email address is already registered. Please use a different email or sign in instead.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address format.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak. Please choose a stronger password.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your internet connection.';
        break;
      case 'auth/popup-closed-by-user':
        errorMessage = 'Sign-up was cancelled.';
        return;
      case 'auth/cancelled-popup-request':
        return;
      default:
        errorMessage = error.message || 'An unexpected error occurred.';
    }

    Alert.alert('Sign-up Error', errorMessage);
  };

  const logoRotate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const nameBorderColor = nameFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(102, 126, 234, 0.3)', 'rgba(102, 126, 234, 0.8)'],
  });

  const emailBorderColor = emailFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(102, 126, 234, 0.3)', 'rgba(102, 126, 234, 0.8)'],
  });

  const passwordBorderColor = passwordFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(102, 126, 234, 0.3)', 'rgba(102, 126, 234, 0.8)'],
  });

  const confirmPasswordBorderColor = confirmPasswordFocusAnim.interpolate({
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
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Header */}
            <Animated.View style={[
              styles.headerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}>
              <TouchableOpacity
                activeOpacity={0.8}
                {...createHoverAnimation(logoScale, 1.1)}
              >
                <Animated.View style={[
                  styles.logoContainer,
                  { transform: [{ scale: logoScale }] }
                ]}>
                  <Animated.View style={[
                    styles.logoIconContainer,
                    { transform: [{ rotate: logoRotate }] }
                  ]}>
                    <LinearGradient
                      colors={['#FF6B6B', '#4ECDC4']}
                      style={styles.logoGradient}
                    >
                      <Ionicons name="walk" size={32} color="#fff" />
                    </LinearGradient>
                  </Animated.View>
                  <View style={styles.logoTextContainer}>
                    <Text style={styles.logoText}>SoL</Text>
                    <Text style={styles.logoTextSecondary}>Mate</Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
              <Text style={styles.tagline}>🚀 Join the Smart Navigation Revolution 🚀</Text>
            </Animated.View>

            {/* Signup Form */}
            <Animated.View style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}>
              <BlurView intensity={80} style={styles.blurContainer}>
                <View style={styles.formContent}>
                  <View style={styles.formHeader}>
                    <Text style={styles.welcomeText}>Create Account</Text>
                    <Text style={styles.subtitleText}>Join SoLMate and start your journey</Text>
                  </View>

                 

                  {/* Form Inputs */}
                  <View style={styles.inputContainer}>
                    {/* Name Input */}
                    <Animated.View style={[
                      styles.inputWrapper,
                      { 
                        borderColor: nameBorderColor,
                        transform: [{ scale: nameInputScale }]
                      }
                    ]}>
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.inputIconGradient}
                      >
                        <Ionicons name="person-outline" size={14} color="#fff" />
                      </LinearGradient>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Full Name"
                        placeholderTextColor="#999"
                        value={formData.name}
                        onChangeText={value => handleInputChange('name', value)}
                        autoCapitalize="words"
                        autoCorrect={false}
                        editable={!loading && !googleLoading}
                        {...createInputFocusAnimation(nameFocusAnim)}
                        {...createHoverAnimation(nameInputScale, 1.02)}
                      />
                    </Animated.View>

                    {/* Email Input */}
                    <Animated.View style={[
                      styles.inputWrapper,
                      { 
                        borderColor: emailBorderColor,
                        transform: [{ scale: emailInputScale }]
                      }
                    ]}>
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.inputIconGradient}
                      >
                        <Ionicons name="mail-outline" size={14} color="#fff" />
                      </LinearGradient>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Email Address"
                        placeholderTextColor="#999"
                        value={formData.email}
                        onChangeText={value => handleInputChange('email', value)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading && !googleLoading}
                        {...createInputFocusAnimation(emailFocusAnim)}
                        {...createHoverAnimation(emailInputScale, 1.02)}
                      />
                    </Animated.View>

                    {/* Password Input */}
                    <Animated.View style={[
                      styles.inputWrapper,
                      { 
                        borderColor: passwordBorderColor,
                        transform: [{ scale: passwordInputScale }]
                      }
                    ]}>
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.inputIconGradient}
                      >
                        <Ionicons name="lock-closed-outline" size={14} color="#fff" />
                      </LinearGradient>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        value={formData.password}
                        onChangeText={value => handleInputChange('password', value)}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading && !googleLoading}
                        {...createInputFocusAnimation(passwordFocusAnim)}
                        {...createHoverAnimation(passwordInputScale, 1.02)}
                      />
                      <Animated.View style={[{ transform: [{ scale: eyeIconScale }] }]}>
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          style={styles.eyeIcon}
                          disabled={loading || googleLoading}
                          activeOpacity={0.7}
                          {...createHoverAnimation(eyeIconScale, 1.2)}
                        >
                          <Ionicons 
                            name={showPassword ? "eye-outline" : "eye-off-outline"} 
                            size={16} 
                            color="#667eea" 
                          />
                        </TouchableOpacity>
                      </Animated.View>
                    </Animated.View>

                    {/* Confirm Password Input */}
                    <Animated.View style={[
                      styles.inputWrapper,
                      { 
                        borderColor: confirmPasswordBorderColor,
                        transform: [{ scale: confirmPasswordInputScale }]
                      }
                    ]}>
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.inputIconGradient}
                      >
                        <Ionicons name="shield-checkmark-outline" size={14} color="#fff" />
                      </LinearGradient>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Confirm Password"
                        placeholderTextColor="#999"
                        value={formData.confirmPassword}
                        onChangeText={value => handleInputChange('confirmPassword', value)}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading && !googleLoading}
                        {...createInputFocusAnimation(confirmPasswordFocusAnim)}
                        {...createHoverAnimation(confirmPasswordInputScale, 1.02)}
                      />
                      <Animated.View style={[{ transform: [{ scale: eyeIcon2Scale }] }]}>
                        <TouchableOpacity
                          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={styles.eyeIcon}
                          disabled={loading || googleLoading}
                          activeOpacity={0.7}
                          {...createHoverAnimation(eyeIcon2Scale, 1.2)}
                        >
                          <Ionicons 
                            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                            size={16} 
                            color="#667eea" 
                          />
                        </TouchableOpacity>
                      </Animated.View>
                    </Animated.View>
                  </View>

                  {/* Sign Up Button */}
                  <Animated.View style={[{ transform: [{ scale: signupButtonScale }] }]}>
                    <TouchableOpacity
                      style={[styles.loginButton, (loading || googleLoading) && styles.loginButtonDisabled]}
                      onPress={handleSignup}
                      disabled={loading || googleLoading}
                      activeOpacity={0.8}
                      {...createHoverAnimation(signupButtonScale)}
                    >
                      <LinearGradient
                        colors={(loading || googleLoading) ? ['#ccc', '#ccc'] : ['#667eea', '#764ba2']}
                        style={styles.loginButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        {loading ? (
                          <View style={styles.loadingContainer}>
                            <Text style={styles.loginButtonText}>Creating Account...</Text>
                          </View>
                        ) : (
                          <>
                            <Ionicons name="person-add-outline" size={16} color="#fff" />
                            <Text style={styles.loginButtonText}>Create Account</Text>
                          </>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>

                  {/* Divider */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>Already have an account?</Text>
                    <View style={styles.divider} />
                  </View>

                  {/* Sign In Button - Now inside the white container */}
                  <Animated.View style={[{ transform: [{ scale: loginButtonScale }] }]}>
                    <TouchableOpacity
                      style={styles.signInButton}
                      onPress={() => navigation.navigate('Login')}
                      disabled={loading || googleLoading}
                      activeOpacity={0.8}
                      {...createHoverAnimation(loginButtonScale)}
                    >
                      <LinearGradient
                        colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
                        style={styles.signInButtonGradient}
                      >
                        <Text style={styles.signInButtonText}>Log In</Text>
                        <Ionicons name="arrow-forward" size={12} color="#667eea" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              </BlurView>
            </Animated.View>
          </KeyboardAvoidingView>
        </ScrollView>
      </LinearGradient>
    </>
  );
}