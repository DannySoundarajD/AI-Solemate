import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';

// Note: For full Bluetooth functionality, you'll need a custom development build
// This version includes mock functionality for development

export default function BluetoothScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [devices, setDevices] = useState([
    {
      id: 'solemate-001',
      name: 'SoleMate-001',
      address: '00:11:22:33:44:55',
      paired: false,
      signal: -45,
      battery: 85,
      status: 'Available',
      type: 'Smart Shoe',
    },
    {
      id: 'solemate-002',
      name: 'SoleMate-002',
      address: '00:11:22:33:44:56',
      paired: false,
      signal: -67,
      battery: 72,
      status: 'Available',
      type: 'Smart Shoe',
    },
    {
      id: 'solemate-003',
      name: 'SoleMate-003',
      address: '00:11:22:33:44:57',
      paired: false,
      signal: -55,
      battery: 91,
      status: 'Available',
      type: 'Smart Shoe',
    },
  ]);

  useEffect(() => {
    requestPermissions();
    simulateBluetoothCheck();
  }, []);

  const requestPermissions = async () => {
    try {
      // Request location permissions (required for Bluetooth scanning)
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required for Bluetooth device scanning.'
        );
        return;
      }
      
      setHasPermissions(true);
    } catch (error) {
      console.error('Permission request error:', error);
      Alert.alert('Error', 'Could not request permissions');
    }
  };

  const simulateBluetoothCheck = () => {
    // Simulate Bluetooth availability check
    setTimeout(() => {
      setIsEnabled(true);
    }, 1000);
  };

  const enableBluetooth = async () => {
    try {
      // In a real app, this would enable Bluetooth
      // For now, we'll simulate it
      Alert.alert(
        'Enable Bluetooth',
        'Please enable Bluetooth in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Settings',
            onPress: () => {
              // In real app: Linking.openSettings();
              setIsEnabled(true);
              Alert.alert('Success', 'Bluetooth enabled successfully');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Could not enable Bluetooth');
    }
  };

  const scanForDevices = async () => {
    if (!isEnabled) {
      Alert.alert('Bluetooth Disabled', 'Please enable Bluetooth first');
      return;
    }

    if (!hasPermissions) {
      Alert.alert('Permissions Required', 'Please grant location permissions');
      return;
    }

    setScanning(true);

    // Simulate scanning process
    setTimeout(() => {
      // Add a new device to simulate discovery
      const newDevice = {
        id: `solemate-${devices.length + 1}`,
        name: `SoleMate-00${devices.length + 1}`,
        address: `00:11:22:33:44:${50 + devices.length}`,
        paired: false,
        signal: Math.floor(Math.random() * 40) - 70,
        battery: Math.floor(Math.random() * 30) + 70,
        status: 'Available',
        type: 'Smart Shoe',
      };

      setDevices(prevDevices => {
        // Check if device already exists
        const exists = prevDevices.some(device => device.id === newDevice.id);
        if (!exists) {
          return [...prevDevices, newDevice];
        }
        return prevDevices;
      });

      setScanning(false);
      Alert.alert('Scan Complete', `Found ${devices.length + 1} SoleMate devices`);
    }, 3000);
  };

  const connectToDevice = async (device) => {
    if (!device) return;

    Alert.alert(
      'Connect to Device',
      `Connect to ${device.name}?\n\nAddress: ${device.address}\nBattery: ${device.battery}%`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect',
          onPress: () => {
            // Simulate connection process
            setTimeout(() => {
              // Disconnect previous device
              setDevices(prevDevices =>
                prevDevices.map(d => ({ 
                  ...d, 
                  paired: d.id === device.id, 
                  status: d.id === device.id ? 'Connected' : 'Available' 
                }))
              );

              setIsConnected(true);
              setConnectedDevice({ ...device, paired: true, status: 'Connected' });
              
              Alert.alert(
                'Connection Successful', 
                `Successfully connected to ${device.name}!\n\nYou can now use navigation and object detection features.`
              );
            }, 1500);
          }
        }
      ]
    );
  };

  const disconnectDevice = () => {
    if (!connectedDevice) return;

    Alert.alert(
      'Disconnect Device',
      `Disconnect from ${connectedDevice.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            // Reset all devices to unpaired
            setDevices(prevDevices =>
              prevDevices.map(d => ({ 
                ...d, 
                paired: false, 
                status: 'Available' 
              }))
            );

            setIsConnected(false);
            setConnectedDevice(null);
            
            Alert.alert('Disconnected', 'Device has been disconnected successfully');
          }
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    
    // Simulate refresh - update device battery levels
    setDevices(prevDevices =>
      prevDevices.map(device => ({
        ...device,
        battery: Math.max(20, Math.min(100, device.battery + Math.floor(Math.random() * 10 - 5))),
        signal: Math.floor(Math.random() * 40) - 70,
      }))
    );

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getSignalStrength = (signal) => {
    if (!signal) return 'Unknown';
    if (signal > -50) return 'Excellent';
    if (signal > -60) return 'Good';
    if (signal > -70) return 'Fair';
    return 'Poor';
  };

  const getSignalColor = (signal) => {
    if (!signal) return '#9CA3AF';
    if (signal > -50) return '#10B981';
    if (signal > -60) return '#F59E0B';
    if (signal > -70) return '#F97316';
    return '#EF4444';
  };

  const getBatteryIcon = (battery) => {
    if (battery > 75) return 'battery-full';
    if (battery > 50) return 'battery-half';
    if (battery > 25) return 'battery-quarter';
    return 'battery-dead';
  };

  const getBatteryColor = (battery) => {
    if (battery > 50) return '#10B981';
    if (battery > 25) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient
        colors={['#3B82F6', '#1E40AF']}
        style={styles.header}
      >
        <Ionicons name="hardware-chip" size={40} color="#FFFFFF" style={styles.headerIcon} />
        <Text style={styles.title}>SoleMate Connection</Text>
        <Text style={styles.subtitle}>Connect to your smart shoe device</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Permission Status */}
        <View style={[styles.card, styles.statusCard, {
          backgroundColor: hasPermissions ? '#ECFDF5' : '#FEF2F2',
          borderColor: hasPermissions ? '#10B981' : '#EF4444'
        }]}>
          <View style={styles.statusHeader}>
            <View style={styles.statusLeft}>
              <Ionicons 
                name="shield-checkmark" 
                size={24} 
                color={hasPermissions ? '#10B981' : '#EF4444'} 
              />
              <View style={styles.statusText}>
                <Text style={[styles.statusTitle, { 
                  color: hasPermissions ? '#065F46' : '#991B1B' 
                }]}>
                  Permissions {hasPermissions ? 'Granted' : 'Required'}
                </Text>
                <Text style={[styles.statusSubtitle, { 
                  color: hasPermissions ? '#047857' : '#B91C1C' 
                }]}>
                  {hasPermissions ? 'Location access granted' : 'Location permission needed'}
                </Text>
              </View>
            </View>
            
            {!hasPermissions && (
              <TouchableOpacity 
                style={styles.enableButton}
                onPress={requestPermissions}
              >
                <Text style={styles.enableButtonText}>Grant</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Bluetooth Status */}
        <View style={[styles.card, styles.statusCard, {
          backgroundColor: isEnabled ? '#ECFDF5' : '#FEF2F2',
          borderColor: isEnabled ? '#10B981' : '#EF4444'
        }]}>
          <View style={styles.statusHeader}>
            <View style={styles.statusLeft}>
              <Ionicons 
                name="bluetooth" 
                size={24} 
                color={isEnabled ? '#10B981' : '#EF4444'} 
              />
              <View style={styles.statusText}>
                <Text style={[styles.statusTitle, { 
                  color: isEnabled ? '#065F46' : '#991B1B' 
                }]}>
                  Bluetooth {isEnabled ? 'Enabled' : 'Disabled'}
                </Text>
                <Text style={[styles.statusSubtitle, { 
                  color: isEnabled ? '#047857' : '#B91C1C' 
                }]}>
                  {isEnabled ? 'Ready to scan for devices' : 'Enable Bluetooth to continue'}
                </Text>
              </View>
            </View>
            
            {!isEnabled && (
              <TouchableOpacity 
                style={styles.enableButton}
                onPress={enableBluetooth}
              >
                <Text style={styles.enableButtonText}>Enable</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Connection Status */}
        {isEnabled && (
          <View style={[styles.card, styles.statusCard, {
            backgroundColor: isConnected ? '#ECFDF5' : '#FEF2F2',
            borderColor: isConnected ? '#10B981' : '#EF4444'
          }]}>
            <View style={styles.statusHeader}>
              <View style={styles.statusLeft}>
                <Ionicons 
                  name="link" 
                  size={24} 
                  color={isConnected ? '#10B981' : '#EF4444'} 
                />
                <View style={styles.statusText}>
                  <Text style={[styles.statusTitle, { 
                    color: isConnected ? '#065F46' : '#991B1B' 
                  }]}>
                    {isConnected ? 'Connected' : 'Not Connected'}
                  </Text>
                  <Text style={[styles.statusSubtitle, { 
                    color: isConnected ? '#047857' : '#B91C1C' 
                  }]}>
                    {isConnected ? connectedDevice?.name : 'No SoleMate device connected'}
                  </Text>
                </View>
              </View>
              
              {isConnected && (
                <TouchableOpacity 
                  style={styles.disconnectButton}
                  onPress={disconnectDevice}
                >
                  <Text style={styles.disconnectButtonText}>Disconnect</Text>
                </TouchableOpacity>
              )}
            </View>

            {isConnected && connectedDevice && (
              <View style={styles.deviceDetails}>
                <View style={styles.deviceDetail}>
                  <Ionicons 
                    name={getBatteryIcon(connectedDevice.battery)} 
                    size={16} 
                    color={getBatteryColor(connectedDevice.battery)} 
                  />
                  <Text style={styles.deviceDetailText}>
                    Battery: {connectedDevice.battery}%
                  </Text>
                </View>
                <View style={styles.deviceDetail}>
                  <Ionicons name="radio" size={16} color="#065F46" />
                  <Text style={styles.deviceDetailText}>
                    Signal: {getSignalStrength(connectedDevice.signal)}
                  </Text>
                </View>
                <View style={styles.deviceDetail}>
                  <Ionicons name="finger-print" size={16} color="#065F46" />
                  <Text style={styles.deviceDetailText}>
                    Address: {connectedDevice.address}
                  </Text>
                </View>
                <View style={styles.deviceDetail}>
                  <Ionicons name="checkmark-circle" size={16} color="#065F46" />
                  <Text style={styles.deviceDetailText}>
                    Type: {connectedDevice.type}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Scan Button */}
        {isEnabled && hasPermissions && (
          <TouchableOpacity
            style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
            onPress={scanForDevices}
            disabled={scanning}
          >
            {scanning ? (
              <ActivityIndicator size="small" color="#FFFFFF" style={styles.scanIcon} />
            ) : (
              <Ionicons name="search" size={20} color="#FFFFFF" style={styles.scanIcon} />
            )}
            <Text style={styles.scanButtonText}>
              {scanning ? 'Scanning for SoleMate Devices...' : 'Scan for SoleMate Devices'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Available Devices */}
        {isEnabled && devices.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Available SoleMate Devices</Text>
              <Text style={styles.deviceCount}>{devices.length} found</Text>
            </View>
            
            <View style={styles.deviceList}>
              {devices.map((device, index) => (
                <View key={device.id} style={styles.deviceItem}>
                  <View style={styles.deviceInfo}>
                    <View style={[styles.deviceIcon, {
                      backgroundColor: device.paired ? '#ECFDF5' : '#EBF8FF',
                    }]}>
                      <Ionicons 
                        name="hardware-chip" 
                        size={24} 
                        color={device.paired ? '#10B981' : '#3B82F6'} 
                      />
                    </View>
                    
                    <View style={styles.deviceDetails}>
                      <Text style={styles.deviceName}>{device.name}</Text>
                      <Text style={styles.deviceType}>{device.type}</Text>
                      <View style={styles.deviceStats}>
                        <View style={styles.deviceStat}>
                          <View style={[styles.signalDot, { 
                            backgroundColor: getSignalColor(device.signal) 
                          }]} />
                          <Text style={styles.deviceStatText}>
                            {device.signal} dBm
                          </Text>
                        </View>
                        <View style={styles.deviceStat}>
                          <Ionicons 
                            name={getBatteryIcon(device.battery)} 
                            size={12} 
                            color={getBatteryColor(device.battery)} 
                          />
                          <Text style={styles.deviceStatText}>
                            {device.battery}%
                          </Text>
                        </View>
                        <View style={styles.deviceStat}>
                          <Ionicons name="finger-print" size={12} color="#6B7280" />
                          <Text style={styles.deviceStatText}>
                            {device.address.slice(-5)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.deviceAction}>
                    {device.paired ? (
                      <View style={styles.connectedBadge}>
                        <Ionicons name="checkmark-circle" size={12} color="#065F46" />
                        <Text style={styles.connectedBadgeText}>Connected</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.connectButton}
                        onPress={() => connectToDevice(device)}
                      >
                        <Text style={styles.connectButtonText}>Connect</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Help Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Connection Help</Text>
          <View style={styles.helpContent}>
            <View style={styles.helpItem}>
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text style={styles.helpText}>
                Make sure your SoleMate device is powered on and in pairing mode
              </Text>
            </View>
            <View style={styles.helpItem}>
              <Ionicons name="refresh" size={20} color="#3B82F6" />
              <Text style={styles.helpText}>
                Pull down to refresh device status or tap scan to find new devices
              </Text>
            </View>
            <View style={styles.helpItem}>
              <Ionicons name="shield-checkmark" size={20} color="#3B82F6" />
              <Text style={styles.helpText}>
                Only connect to trusted SoleMate devices with proper authentication
              </Text>
            </View>
            <View style={styles.helpItem}>
              <Ionicons name="location" size={20} color="#3B82F6" />
              <Text style={styles.helpText}>
                Location permissions are required for Bluetooth device discovery
              </Text>
            </View>
            <View style={styles.helpItem}>
              <Ionicons name="build" size={20} color="#3B82F6" />
              <Text style={styles.helpText}>
                For full functionality, install the app on a physical device
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
    alignItems: 'center',
  },
  headerIcon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#BFDBFE',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    padding: 20,
    paddingTop: 25,
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
  statusCard: {
    borderWidth: 1,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusText: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  enableButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  enableButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  disconnectButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disconnectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  deviceDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#D1FAE5',
  },
  deviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  deviceDetailText: {
    fontSize: 12,
    color: '#065F46',
    marginLeft: 6,
  },
  scanButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  scanButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  scanIcon: {
    marginRight: 8,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  deviceCount: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deviceList: {
    gap: 16,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#EBF8FF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  deviceStats: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  deviceStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 2,
  },
  signalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  deviceStatText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 2,
  },
  deviceAction: {
    marginLeft: 12,
  },
  connectedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  connectedBadgeText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '600',
  },
  connectButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  helpContent: {
    gap: 16,
    marginTop: 12,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginLeft: 12,
  },
});