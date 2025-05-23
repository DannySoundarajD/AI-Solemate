// config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDWkCJVc90N-sqvPu8G5P7TtTcWd0Wbw5I",
  authDomain: "ai-solemate.firebaseapp.com",
  projectId: "ai-solemate",
  storageBucket: "ai-solemate.firebasestorage.app",
  messagingSenderId: "731372976518",
  appId: "1:731372976518:web:2cae49b39c2749c6af1407",
  measurementId: "G-2KB7CGSWQP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with Expo-specific handling
let auth;
try {
  // For Expo, we need to be more careful with auth initialization
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  console.log('✅ Firebase Auth initialized successfully with persistence');
} catch (error) {
  // If already initialized, get the existing instance
  console.log('⚠️ Auth already initialized, getting existing instance');
  console.log('Error details:', error.message);
  auth = getAuth(app);
}

// Initialize Firestore
export const db = getFirestore(app);

// Add debugging for auth state
auth.onAuthStateChanged((user) => {
  console.log('🔄 Firebase Config: Auth state changed');
  console.log('📊 User exists:', !!user);
  if (user) {
    console.log('✅ User authenticated:', user.email);
  } else {
    console.log('❌ User not authenticated');
  }
});

export { auth };
export default app;