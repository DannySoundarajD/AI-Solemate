// styles/SignupStyles.js
import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

// Responsive sizing function
const isTabletOrDesktop = width >= 768;
const scale = (size) => {
  if (isTabletOrDesktop) {
    return size; 
  }
  return size;
};

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: scale(20),
    minHeight: height,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(15),
    maxWidth: isTabletOrDesktop ? 520 : '100%',
    alignSelf: 'center',
  },
  
  // Background Elements
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
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 100,
  },
  element1: {
    width: scale(180),
    height: scale(180),
    top: -scale(90),
    right: -scale(90),
  },
  element2: {
    width: scale(140),
    height: scale(140),
    bottom: scale(100),
    left: -scale(70),
  },
  element3: {
    width: scale(100),
    height: scale(100),
    top: '35%',
    right: -scale(50),
  },
  
  // Header Styles - Reduced sizes
  headerContainer: {
    alignItems: 'center',
    marginBottom: scale(20),
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  logoIconContainer: {
    marginRight: scale(12),
  },
  logoGradient: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(22.5),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoTextContainer: {
    alignItems: 'flex-start',
  },
  logoText: {
    fontSize: scale(26),
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 6,
  },
  logoTextSecondary: {
    fontSize: scale(18),
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.95)',
    marginTop: -3,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: scale(13),
    color: 'rgba(255, 255, 255, 0.92)',
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.3,
  },
  
  // Form Styles - Reduced padding
  formContainer: {
    borderRadius: scale(18),
    overflow: 'hidden',
    marginVertical: scale(15),
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 12,
    width: '100%',
    alignSelf: 'center',
  },
  blurContainer: {
    borderRadius: scale(18),
    overflow: 'hidden',
  },
  formContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    padding: scale(20),
    borderRadius: scale(18),
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: scale(18),
  },
  welcomeText: {
    fontSize: scale(24),
    fontWeight: '800',
    color: '#667eea',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  subtitleText: {
    fontSize: scale(13),
    color: '#555',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: scale(18),
  },
  
  // Input Styles - Reduced sizes
  inputContainer: {
    marginBottom: scale(16),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: scale(12),
    paddingHorizontal: scale(12),
    paddingVertical: scale(2),
    marginBottom: scale(10),
    borderWidth: 1.5,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIconGradient: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(10),
  },
  textInput: {
    flex: 1,
    fontSize: scale(14),
    color: '#333',
    paddingVertical: scale(12),
    fontWeight: '500',
  },
  eyeIcon: {
    padding: scale(8),
    borderRadius: scale(6),
  },
  
  // Google Button Styles
  googleButton: {
    borderRadius: scale(12),
    marginBottom: scale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  googleButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleIcon: {
    width: scale(18),
    height: scale(18),
    marginRight: scale(10),
  },
  googleButtonText: {
    fontSize: scale(14),
    fontWeight: '600',
    color: '#333',
    letterSpacing: 0.2,
  },
  
  // Login Button Styles
  loginButton: {
    borderRadius: scale(12),
    marginBottom: scale(16),
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(14),
    paddingHorizontal: scale(20),
    borderRadius: scale(12),
    gap: scale(8),
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: scale(15),
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Divider Styles
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(-15),
    padding: scale(15),
    marginVertical: scale(2),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(7, 7, 8, 0.2)',
  },
  dividerText: {
    fontSize: scale(12),
    color: '#777',
    paddingHorizontal: scale(15),
    fontWeight: '500',
  },
  
  // Sign In Button Styles
  signInButton: {
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  signInButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(12),
    gap: scale(6),
  },
  signInButtonText: {
    fontSize: scale(14),
    fontWeight: '600',
    color: '#667eea',
    letterSpacing: 0.2,
  },
  
  // Feature Highlights (if needed)
  featuresContainer: {
    marginTop: scale(20),
    paddingHorizontal: scale(20),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: scale(10),
    paddingHorizontal: scale(15),
    borderRadius: scale(10),
  },
  featureIcon: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  featureText: {
    flex: 1,
    fontSize: scale(13),
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    lineHeight: scale(18),
  },
  
  // Error Styles
  errorText: {
    fontSize: scale(12),
    color: '#FF6B6B',
    marginTop: scale(4),
    marginLeft: scale(36),
    fontWeight: '500',
  },
  
  // Success Styles
  successText: {
    fontSize: scale(12),
    color: '#4ECDC4',
    marginTop: scale(4),
    marginLeft: scale(36),
    fontWeight: '500',
  },
  
  // Loading Indicator Styles
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(18),
    zIndex: 1000,
  },
  loadingText: {
    marginTop: scale(10),
    fontSize: scale(14),
    color: '#667eea',
    fontWeight: '600',
  },
  
  // Accessibility Styles
  accessibilityButton: {
    minHeight: scale(44),
    minWidth: scale(44),
  },
  
  // Focus Styles
  inputFocused: {
    borderColor: '#667eea',
    borderWidth: 2,
    shadowColor: '#667eea',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  
  // Responsive adjustments for tablets/desktop
  tabletContainer: {
    maxWidth: 520,
    alignSelf: 'center',
  },
  tabletFormContent: {
    paddingHorizontal: scale(40),
    paddingVertical: scale(30),
  },
  
  // Additional animation support styles
  animatedContainer: {
    transform: [{ scale: 1 }],
  },
  pressedContainer: {
    transform: [{ scale: 0.98 }],
  },
});