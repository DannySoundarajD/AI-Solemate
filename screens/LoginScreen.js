// screens/LoginScreen.js
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
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  doc,
  updateDoc,
  serverTimestamp,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import styles from '../styles/LoginStyles';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Hover animation values
  const googleButtonScale = useRef(new Animated.Value(1)).current;
  const loginButtonScale = useRef(new Animated.Value(1)).current;
  const signupButtonScale = useRef(new Animated.Value(1)).current;
  const forgotPasswordScale = useRef(new Animated.Value(1)).current;
  const eyeIconScale = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const emailInputScale = useRef(new Animated.Value(1)).current;
  const passwordInputScale = useRef(new Animated.Value(1)).current;
  
  // Input focus animations
  const emailFocusAnim = useRef(new Animated.Value(0)).current;
  const passwordFocusAnim = useRef(new Animated.Value(0)).current;

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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please fill in all fields to continue');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    console.log('Attempting login with:', email);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential.user.email);
      await updateLastLogin(userCredential.user.uid);
    } catch (error) {
      console.error('Login error:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('Google login successful:', user.email);

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
          preferences: {
            voiceGuidance: true,
            hapticFeedback: true,
            emergencyContacts: [],
            language: 'en',
          },
        });
        console.log('New Google user document created');
      } else {
        await updateLastLogin(user.uid);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      handleAuthError(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const updateLastLogin = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        lastLoginAt: serverTimestamp(),
      });
      console.log('Last login timestamp updated');
    } catch (firestoreError) {
      console.error('Failed to update last login timestamp:', firestoreError);
    }
  };

  const handleAuthError = (error) => {
    let errorMessage = 'Authentication failed. Please try again.';

    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address format.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your internet connection.';
        break;
      case 'auth/popup-closed-by-user':
        errorMessage = 'Sign-in was cancelled.';
        return;
      case 'auth/cancelled-popup-request':
        return;
      default:
        errorMessage = error.message || 'An unexpected error occurred.';
    }

    Alert.alert('Authentication Error', errorMessage);
  };

  const logoRotate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const emailInputBorderColor = emailFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(102, 126, 234, 0.3)', 'rgba(102, 126, 234, 0.8)'],
  });

  const passwordInputBorderColor = passwordFocusAnim.interpolate({
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
              <Text style={styles.tagline}>✨ Smart Navigation for Everyone ✨</Text>
            </Animated.View>

            {/* Login Form */}
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
                    <Text style={styles.welcomeText}>Welcome Back</Text>
                    <Text style={styles.subtitleText}>Sign in to continue your journey</Text>
                  </View>

                  {/* Google Sign-In Button */}
                  <Animated.View style={[{ transform: [{ scale: googleButtonScale }] }]}>
                    <TouchableOpacity
                      style={[styles.googleButton, googleLoading && styles.googleButtonDisabled]}
                      onPress={handleGoogleLogin}
                      disabled={googleLoading || loading}
                      activeOpacity={0.8}
                      {...createHoverAnimation(googleButtonScale)}
                    >
                      <LinearGradient
                        colors={['#ffffff', '#f8f9fa']}
                        style={styles.googleButtonGradient}
                      >
                        <View style={styles.googleButtonContent}>
                          <Ionicons name="logo-google" size={18} color="#DB4437" />
                          <Text style={styles.googleButtonText}>
                            {googleLoading ? 'Signing in...' : 'Continue with Google'}
                          </Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>

                  {/* Email / Password Inputs */}
                  <View style={styles.inputContainer}>
                    <Animated.View style={[
                      styles.inputWrapper,
                      { 
                        borderColor: emailInputBorderColor,
                        transform: [{ scale: emailInputScale }]
                      }
                    ]}>
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.inputIconGradient}
                      >
                        <Ionicons name="mail-outline" size={16} color="#fff" />
                      </LinearGradient>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Email Address"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading && !googleLoading}
                        {...createInputFocusAnimation(emailFocusAnim)}
                        {...createHoverAnimation(emailInputScale, 1.02)}
                      />
                    </Animated.View>

                    <Animated.View style={[
                      styles.inputWrapper,
                      { 
                        borderColor: passwordInputBorderColor,
                        transform: [{ scale: passwordInputScale }]
                      }
                    ]}>
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.inputIconGradient}
                      >
                        <Ionicons name="lock-closed-outline" size={16} color="#fff" />
                      </LinearGradient>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
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
                            size={18} 
                            color="#667eea" 
                          />
                        </TouchableOpacity>
                      </Animated.View>
                    </Animated.View>
                  </View>

                  {/* Email Sign-In Button */}
                  <Animated.View style={[{ transform: [{ scale: loginButtonScale }] }]}>
                    <TouchableOpacity
                      style={[styles.loginButton, (loading || googleLoading) && styles.loginButtonDisabled]}
                      onPress={handleLogin}
                      disabled={loading || googleLoading}
                      activeOpacity={0.8}
                      {...createHoverAnimation(loginButtonScale)}
                    >
                      <LinearGradient
                        colors={(loading || googleLoading) ? ['#ccc', '#ccc'] : ['#667eea', '#764ba2']}
                        style={styles.loginButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        {loading ? (
                          <View style={styles.loadingContainer}>
                            <Text style={styles.loginButtonText}>Logging in...</Text>
                          </View>
                        ) : (
                          <>
                            <Ionicons name="log-in-outline" size={18} color="#fff" />
                            <Text style={styles.loginButtonText}>Log In</Text>
                          </>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>

                  <Animated.View style={[{ transform: [{ scale: forgotPasswordScale }] }]}>
                    <TouchableOpacity
                      style={styles.forgotPasswordContainer}
                      onPress={() => navigation.navigate('ForgotPassword')}
                      disabled={loading || googleLoading}
                      activeOpacity={0.7}
                      {...createHoverAnimation(forgotPasswordScale, 1.05)}
                    >
                      <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              </BlurView>
            </Animated.View>

            {/* Footer */}
            <Animated.View style={[
              styles.footerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}>
              <View style={styles.footerDividerContainer}>
                <View style={styles.footerDivider} />
                <Text style={styles.footerDividerText}>New to SoLMate?</Text>
                <View style={styles.footerDivider} />
              </View>

              <Animated.View style={[{ transform: [{ scale: signupButtonScale }] }]}>
                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={() => navigation.navigate('Signup')}
                  disabled={loading || googleLoading}
                  activeOpacity={0.8}
                  {...createHoverAnimation(signupButtonScale)}
                >
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                    style={styles.signupButtonGradient}
                  >
                    <Text style={styles.signupButtonText}>Create Account</Text>
                    <Ionicons name="arrow-forward" size={14} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </KeyboardAvoidingView>
        </ScrollView>
      </LinearGradient>
    </>
  );
}