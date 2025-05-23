import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from "../styles/ObjectDetectionStyles"
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function ObjectDetectionScreen() {
  // State
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [cameraStatus, setCameraStatus] = useState('Ready');
  const [batteryLevel, setBatteryLevel] = useState(85);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const statusPulseAnim = useRef(new Animated.Value(1)).current;
  const scanningAnim = useRef(new Animated.Value(0)).current;
  
  // Button animation values
  const detectButtonScale = useRef(new Animated.Value(1)).current;
  const clearButtonScale = useRef(new Animated.Value(1)).current;
  const settingsButtonScale = useRef(new Animated.Value(1)).current;

  const mockObjects = [
    { id: 1, name: 'Chair', confidence: 0.95, distance: '2 meters ahead', direction: 'center', risk: 'low' },
    { id: 2, name: 'Table', confidence: 0.87, distance: '3 meters to the right', direction: 'right', risk: 'medium' },
    { id: 3, name: 'Person', confidence: 0.92, distance: '5 meters ahead', direction: 'center', risk: 'low' },
    { id: 4, name: 'Door', confidence: 0.89, distance: '1 meter left', direction: 'left', risk: 'low' },
    { id: 5, name: 'Steps', confidence: 0.78, distance: '4 meters ahead', direction: 'center', risk: 'high' },
  ];

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
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Status pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(statusPulseAnim, {
          toValue: 1.2,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(statusPulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Battery simulation
    const batteryInterval = setInterval(() => {
      setBatteryLevel(prev => Math.max(prev - 1, 0));
    }, 30000);

    return () => {
      clearInterval(batteryInterval);
    };
  }, []);

  // Scanning animation
  useEffect(() => {
    if (isDetecting) {
      Animated.loop(
        Animated.timing(scanningAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ).start();
    } else {
      scanningAnim.setValue(0);
    }
  }, [isDetecting]);

  // Animation helper functions
  const createHoverAnimation = (animValue, toValue = 1.05) => ({
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

  const startDetection = async () => {
    if (!isConnected) {
      Alert.alert('Device Not Connected', 'Please connect your SoleMate device first');
      return;
    }

    setIsDetecting(true);
    setCameraStatus('Analyzing...');
    
    // Simulate AI detection process
    setTimeout(() => {
      const numObjects = Math.floor(Math.random() * 4) + 1;
      const selectedObjects = mockObjects
        .sort(() => 0.5 - Math.random())
        .slice(0, numObjects)
        .map((obj, index) => ({
          ...obj,
          id: Date.now() + index,
          timestamp: new Date().toLocaleTimeString(),
        }));

      setDetectedObjects(selectedObjects);
      setDetectionHistory(prev => [...selectedObjects, ...prev].slice(0, 20));
      setIsDetecting(false);
      setCameraStatus('Detection Complete');
      
      // Announce objects via alert (in real app, this would be voice)
      const objectNames = selectedObjects.map(obj => obj.name).join(', ');
      Alert.alert('Objects Detected', `Found: ${objectNames}`);
    }, 3000);
  };

  const stopDetection = () => {
    setIsDetecting(false);
    setCameraStatus('Stopped');
    setDetectedObjects([]);
  };

  const clearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear detection history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => setDetectionHistory([]) }
      ]
    );
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return ['#EF4444', '#DC2626'];
      case 'medium': return ['#F59E0B', '#D97706'];
      case 'low': return ['#10B981', '#059669'];
      default: return ['#6B7280', '#4B5563'];
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'high': return 'warning';
      case 'medium': return 'alert-circle';
      case 'low': return 'checkmark-circle';
      default: return 'help-circle';
    }
  };

  const getDirectionIcon = (direction) => {
    switch (direction) {
      case 'left': return 'arrow-back';
      case 'right': return 'arrow-forward';
      case 'center': return 'arrow-up';
      default: return 'locate';
    }
  };

  const speakObject = (objectName) => {
    Alert.alert('Voice Announcement', `"${objectName}" detected`);
  };

  const logoRotate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scanningOpacity = scanningAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  const scanningScale = scanningAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.1, 0.8],
  });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
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
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.headerGradient}
            >
              <View style={styles.statusBar}>
                <View style={styles.appTitle}>
                  <Animated.View style={[
                    styles.logoIconContainer,
                    { transform: [{ rotate: logoRotate }] }
                  ]}>
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      style={styles.logoGradient}
                    >
                      <Ionicons name="eye" size={24} color="#fff" />
                    </LinearGradient>
                  </Animated.View>
                  <View style={styles.titleContainer}>
                    <Text style={styles.appTitleText}>Object Detection</Text>
                    <Animated.View style={[
                      styles.statusDot, 
                      { 
                        backgroundColor: isConnected ? '#10B981' : '#EF4444',
                        transform: [{ scale: statusPulseAnim }]
                      }
                    ]} />
                  </View>
                </View>
                
                <View style={styles.statusInfo}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                    style={styles.batteryContainer}
                  >
                    <Ionicons name="battery-half" size={16} color="#FFFFFF" />
                    <Text style={styles.batteryText}>{batteryLevel}%</Text>
                  </LinearGradient>
                </View>
              </View>

              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>AI Vision Active</Text>
                <Text style={styles.welcomeSubtitle}>Real-time object recognition</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Camera Status Card */}
          <Animated.View style={[
            styles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            <BlurView intensity={80} style={styles.blurContainer}>
              <View style={[styles.card, styles.statusCard]}>
                <View style={styles.statusHeader}>
                  <View style={styles.statusLeft}>
                    <LinearGradient
                      colors={['#8B5CF6', '#7C3AED']}
                      style={styles.iconGradient}
                    >
                      <Ionicons name="camera" size={20} color="#fff" />
                    </LinearGradient>
                    <View style={styles.statusInfo}>
                      <Text style={styles.statusTitle}>Camera Status</Text>
                      <Text style={styles.statusText}>{cameraStatus}</Text>
                    </View>
                  </View>
                  <Animated.View style={[
                    styles.connectionDot, 
                    { 
                      backgroundColor: isConnected ? '#10B981' : '#EF4444',
                      transform: [{ scale: statusPulseAnim }]
                    }
                  ]} />
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Detection Controls Card */}
          <Animated.View style={[
            styles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            <BlurView intensity={80} style={styles.blurContainer}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.iconGradient}
                  >
                    <Ionicons name="settings" size={16} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.cardTitle}>Detection Controls</Text>
                </View>
                
                <View style={styles.controlButtons}>
                  <Animated.View style={[{ transform: [{ scale: detectButtonScale }] }]}>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={isDetecting ? stopDetection : startDetection}
                      disabled={!isConnected}
                      activeOpacity={0.8}
                      {...createHoverAnimation(detectButtonScale)}
                    >
                      <LinearGradient
                        colors={isDetecting ? ['#EF4444', '#DC2626'] : ['#8B5CF6', '#7C3AED']}
                        style={styles.primaryButtonGradient}
                      >
                        {isDetecting ? (
                          <Animated.View style={[
                            styles.scanningContainer,
                            {
                              opacity: scanningOpacity,
                              transform: [{ scale: scanningScale }]
                            }
                          ]}>
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          </Animated.View>
                        ) : (
                          <Ionicons name="eye" size={20} color="#FFFFFF" />
                        )}
                        <Text style={styles.primaryButtonText}>
                          {isDetecting ? 'Stop Detection' : 'Start Detection'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>

                  <View style={styles.secondaryButtons}>
                    <Animated.View style={[{ transform: [{ scale: settingsButtonScale }] }]}>
                      <TouchableOpacity 
                        style={styles.secondaryButton}
                        {...createHoverAnimation(settingsButtonScale)}
                      >
                        <LinearGradient
                          colors={['rgba(139, 92, 246, 0.1)', 'rgba(124, 58, 237, 0.1)']}
                          style={styles.secondaryButtonGradient}
                        >
                          <Ionicons name="settings" size={18} color="#8B5CF6" />
                          <Text style={styles.secondaryButtonText}>Settings</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                    
                    <Animated.View style={[{ transform: [{ scale: clearButtonScale }] }]}>
                      <TouchableOpacity 
                        style={styles.secondaryButton}
                        onPress={clearHistory}
                        {...createHoverAnimation(clearButtonScale)}
                      >
                        <LinearGradient
                          colors={['rgba(239, 68, 68, 0.1)', 'rgba(220, 38, 38, 0.1)']}
                          style={styles.secondaryButtonGradient}
                        >
                          <Ionicons name="trash" size={18} color="#EF4444" />
                          <Text style={[styles.secondaryButtonText, { color: '#EF4444' }]}>Clear</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Current Detection Results */}
          {detectedObjects.length > 0 && (
            <Animated.View style={[
              styles.cardContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}>
              <BlurView intensity={80} style={styles.blurContainer}>
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      style={styles.iconGradient}
                    >
                      <Ionicons name="checkmark-circle" size={16} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.cardTitle}>Current Detection</Text>
                    <LinearGradient
                      colors={['rgba(16, 185, 129, 0.1)', 'rgba(5, 150, 105, 0.1)']}
                      style={styles.objectCountContainer}
                    >
                      <Text style={styles.objectCount}>{detectedObjects.length} objects</Text>
                    </LinearGradient>
                  </View>
                  
                  <View style={styles.objectList}>
                    {detectedObjects.map((object, index) => (
                      <Animated.View 
                        key={object.id} 
                        style={[
                          styles.objectItem,
                          {
                            opacity: fadeAnim,
                            transform: [{
                              translateX: slideAnim.interpolate({
                                inputRange: [0, 50],
                                outputRange: [0, (index % 2 === 0 ? -50 : 50)],
                              })
                            }]
                          }
                        ]}
                      >
                        <LinearGradient
                          colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)']}
                          style={styles.objectItemGradient}
                        >
                          <View style={styles.objectLeft}>
                            <LinearGradient
                              colors={getRiskColor(object.risk)}
                              style={styles.objectIcon}
                            >
                              <Ionicons name="cube" size={20} color="#fff" />
                            </LinearGradient>
                            
                            <View style={styles.objectInfo}>
                              <Text style={styles.objectName}>{object.name}</Text>
                              <Text style={styles.objectDistance}>{object.distance}</Text>
                              
                              <View style={styles.objectDetails}>
                                <View style={styles.objectDetail}>
                                  <Ionicons 
                                    name={getDirectionIcon(object.direction)} 
                                    size={12} 
                                    color="#6B7280" 
                                  />
                                  <Text style={styles.objectDetailText}>{object.direction}</Text>
                                </View>
                                
                                <View style={styles.objectDetail}>
                                  <Ionicons 
                                    name={getRiskIcon(object.risk)} 
                                    size={12} 
                                    color={getRiskColor(object.risk)[0]} 
                                  />
                                  <Text style={[styles.objectDetailText, { 
                                    color: getRiskColor(object.risk)[0] 
                                  }]}>
                                    {object.risk} risk
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>

                          <View style={styles.objectRight}>
                            <LinearGradient
                              colors={['rgba(30, 64, 175, 0.1)', 'rgba(30, 64, 175, 0.05)']}
                              style={styles.confidenceContainer}
                            >
                              <Text style={styles.confidenceText}>
                                {Math.round(object.confidence * 100)}%
                              </Text>
                            </LinearGradient>
                            
                            <TouchableOpacity 
                              style={styles.speakButton}
                              onPress={() => speakObject(object.name)}
                            >
                              <LinearGradient
                                colors={['#8B5CF6', '#7C3AED']}
                                style={styles.speakButtonGradient}
                              >
                                <Ionicons name="volume-high" size={16} color="#fff" />
                              </LinearGradient>
                            </TouchableOpacity>
                          </View>
                        </LinearGradient>
                      </Animated.View>
                    ))}
                  </View>
                </View>
              </BlurView>
            </Animated.View>
          )}

          {/* Detection History */}
          {detectionHistory.length > 0 && (
            <Animated.View style={[
              styles.cardContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}>
              <BlurView intensity={80} style={styles.blurContainer}>
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <LinearGradient
                      colors={['#6B7280', '#4B5563']}
                      style={styles.iconGradient}
                    >
                      <Ionicons name="time" size={16} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.cardTitle}>Recent Detections</Text>
                    <TouchableOpacity onPress={clearHistory}>
                      <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.historyList} nestedScrollEnabled={true}>
                    {detectionHistory.slice(0, 10).map((object, index) => (
                      <LinearGradient
                        key={`${object.id}-${index}`}
                        colors={['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.3)']}
                        style={styles.historyItem}
                      >
                        <View style={styles.historyLeft}>
                          <Ionicons name="time" size={14} color="#6B7280" />
                          <Text style={styles.historyTime}>{object.timestamp}</Text>
                        </View>
                        
                        <View style={styles.historyRight}>
                          <Text style={styles.historyObject}>{object.name}</Text>
                          <LinearGradient
                            colors={['rgba(30, 64, 175, 0.1)', 'rgba(30, 64, 175, 0.05)']}
                            style={styles.historyConfidenceContainer}
                          >
                            <Text style={styles.historyConfidence}>
                              {Math.round(object.confidence * 100)}%
                            </Text>
                          </LinearGradient>
                        </View>
                      </LinearGradient>
                    ))}
                  </ScrollView>
                </View>
              </BlurView>
            </Animated.View>
          )}

          {/* Detection Tips */}
          <Animated.View style={[
            styles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            <BlurView intensity={80} style={styles.blurContainer}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    style={styles.iconGradient}
                  >
                    <Ionicons name="bulb" size={16} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.cardTitle}>Detection Tips</Text>
                </View>
                <View style={styles.tipsList}>
                  {[
                    { icon: 'sunny', text: 'Better lighting improves detection accuracy', colors: ['#F59E0B', '#D97706'] },
                    { icon: 'walk', text: 'Move slowly for more accurate results', colors: ['#10B981', '#059669'] },
                    { icon: 'volume-high', text: 'Use voice announcements for hands-free operation', colors: ['#8B5CF6', '#7C3AED'] }
                  ].map((tip, index) => (
                    <LinearGradient
                      key={index}
                      colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.4)']}
                      style={styles.tipItem}
                    >
                      <LinearGradient
                        colors={tip.colors}
                        style={styles.tipIconContainer}
                      >
                        <Ionicons name={tip.icon} size={20} color="#fff" />
                      </LinearGradient>
                      <Text style={styles.tipText}>{tip.text}</Text>
                    </LinearGradient>
                  ))}
                </View>
              </View>
            </BlurView>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

