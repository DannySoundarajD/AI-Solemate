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
    paddingHorizontal: scale(20),
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
    marginBottom: scale(30),
    marginTop: scale(50),
  },
  logoContainer: {
    marginBottom: scale(15),
  },
  logoGradient: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
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
  title: {
    fontSize: scale(28),
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: scale(8),
  },
  subtitle: {
    fontSize: scale(16),
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  // Status Cards
  statusContainer: {
    marginBottom: scale(20),
  },
  statusCard: {
    borderRadius: scale(16),
    overflow: 'hidden',
    marginBottom: scale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  statusContent: {
    padding: scale(20),
    borderRadius: scale(16),
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconGradient: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontSize: scale(16),
    fontWeight: '700',
    color: '#fff',
    marginBottom: scale(2),
  },
  statusSubtitle: {
    fontSize: scale(12),
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  actionButton: {
    borderRadius: scale(12),
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtonGradient: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: scale(12),
    fontWeight: '600',
  },
  disconnectButton: {
    borderRadius: scale(12),
    overflow: 'hidden',
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  deviceDetails: {
    marginTop: scale(16),
    paddingTop: scale(16),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  deviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  deviceDetailText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: scale(12),
    marginLeft: scale(8),
    fontWeight: '500',
  },

  // Scan Button
  scanButton: {
    marginHorizontal: scale(20),
    marginBottom: scale(20),
    borderRadius: scale(16),
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  scanButtonDisabled: {
    opacity: 0.7,
  },
  scanButtonGradient: {
    paddingVertical: scale(16),
    paddingHorizontal: scale(24),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIcon: {
    marginRight: scale(8),
  },
  scanButtonText: {
    color: '#fff',
    fontSize: scale(16),
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Devices Container
  devicesContainer: {
    marginBottom: scale(20),
  },
  devicesCard: {
    borderRadius: scale(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  devicesContent: {
    padding: scale(20),
  },
  devicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(16),
  },
  devicesTitle: {
    fontSize: scale(18),
    fontWeight: '700',
    color: '#fff',
  },
  deviceCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: scale(12),
    paddingVertical: scale(4),
    borderRadius: scale(12),
  },
  deviceCountText: {
    color: '#fff',
    fontSize: scale(12),
    fontWeight: '600',
  },
  deviceList: {
    gap: scale(12),
  },
  deviceItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scale(12),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  deviceInfoText: {
    flex: 1,
  },
  deviceName: {
    fontSize: scale(16),
    fontWeight: '700',
    color: '#fff',
    marginBottom: scale(2),
  },
  deviceType: {
    fontSize: scale(12),
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: scale(6),
  },
  deviceStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  deviceStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  signalDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
  deviceStatText: {
    fontSize: scale(10),
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  deviceAction: {
    marginLeft: scale(12),
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(12),
    gap: scale(4),
  },
  connectedBadgeText: {
    color: '#10B981',
    fontSize: scale(10),
    fontWeight: '600',
  },
  connectButton: {
    borderRadius: scale(12),
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  connectButtonGradient: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: scale(12),
    fontWeight: '600',
  },

  // Help Section
  helpContainer: {
    marginBottom: scale(20),
  },
  helpCard: {
    borderRadius: scale(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  helpContent: {
    padding: scale(20),
  },
  helpTitle: {
    fontSize: scale(18),
    fontWeight: '700',
    color: '#fff',
    marginBottom: scale(16),
  },
  helpItems: {
    gap: scale(12),
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(12),
  },
  helpIconGradient: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale(2),
  },
  helpText: {
    flex: 1,
    fontSize: scale(14),
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: scale(20),
    fontWeight: '500',
  },
});