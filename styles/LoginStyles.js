// styles/LoginStyles.js
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
    paddingVertical: scale(15),
    minHeight: height,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    maxWidth: isTabletOrDesktop ? 500 : '100%',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
  },
  element1: {
    width: scale(150),
    height: scale(150),
    top: -scale(75),
    right: -scale(75),
  },
  element2: {
    width: scale(120),
    height: scale(120),
    bottom: scale(80),
    left: -scale(60),
  },
  element3: {
    width: scale(80),
    height: scale(80),
    top: '40%',
    right: -scale(40),
  },
  
  // Header Styles
  headerContainer: {
    alignItems: 'center',
    marginBottom: scale(20),
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(10),
  },
  logoIconContainer: {
    marginRight: scale(12),
  },
  logoGradient: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
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
    fontSize: scale(28),
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  logoTextSecondary: {
    fontSize: scale(20),
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: -4,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tagline: {
    fontSize: scale(14),
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  // Form Styles
  formContainer: {
    borderRadius: scale(16),
    overflow: 'hidden',
    marginVertical: scale(15),
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 12,
    width: '100%',
    alignSelf: 'center',
  },
  blurContainer: {
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  formContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: scale(40),
    borderRadius: scale(16),
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: scale(20),
  },
  welcomeText: {
    fontSize: scale(26),
    fontWeight: '800',
    color: '#667eea',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: scale(14),
    color: '#666',
    textAlign: 'center',
    fontWeight: '400',
  },

  // Input Styles
  inputContainer: {
    marginBottom: scale(18),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.2)',
    borderRadius: scale(12),
    marginBottom: scale(15),
    paddingRight: scale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    height: scale(48),
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIconGradient: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: scale(8),
    marginRight: scale(12),
  },
  textInput: {
    flex: 1,
    fontSize: scale(14),
    color: '#333',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: scale(6),
    borderRadius: scale(12),
  },

  // Button Styles
  googleButton: {
    borderRadius: scale(12),
    marginBottom: scale(18),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  googleButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  googleButtonGradient: {
    borderRadius: scale(12),
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
  },
  googleButtonText: {
    color: '#333',
    fontSize: scale(14),
    fontWeight: '700',
    marginLeft: scale(8),
  },

  loginButton: {
    borderRadius: scale(12),
    overflow: 'hidden',
    marginBottom: scale(15),
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
  },
  loginButtonText: {
    color: '#fff',
    fontSize: scale(16),
    fontWeight: '700',
    marginLeft: scale(8),
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Forgot Password
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: scale(10),
  },
  forgotPasswordText: {
    color: '#667eea',
    fontSize: scale(14),
    fontWeight: '600',
  },

  // Divider Styles
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scale(5),
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
  },
  dividerText: {
    color: '#667eea',
    fontSize: scale(12),
    marginHorizontal: scale(15),
    fontWeight: '600',
  },

  // Footer Styles
  footerContainer: {
    alignItems: 'center',
    marginTop: scale(10),
  },
  footerDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(15),
    width: '100%',
  },
  footerDivider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  footerDividerText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: scale(12),
    marginHorizontal: scale(15),
    fontWeight: '500',
  },

  signupButton: {
    borderRadius: scale(16),
    overflow: 'hidden',
    marginBottom: scale(18),
    shadowColor: 'rgba(255, 255, 255, 0.3)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  signupButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(10),
    paddingHorizontal: scale(25),
    
  },
  signupButtonText: {
    color: '#fff',
    fontSize: scale(14),
    fontWeight: '700',
    marginRight: scale(8),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Features Section
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: scale(12),
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: scale(15),
    width: scale(30),
    height: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(6),
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  featureText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: scale(10),
    textAlign: 'center',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});