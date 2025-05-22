import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ObjectDetectionScreen() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [cameraStatus, setCameraStatus] = useState('Ready');

  const mockObjects = [
    { id: 1, name: 'Chair', confidence: 0.95, distance: '2 meters ahead', direction: 'center', risk: 'low' },
    { id: 2, name: 'Table', confidence: 0.87, distance: '3 meters to the right', direction: 'right', risk: 'medium' },
    { id: 3, name: 'Person', confidence: 0.92, distance: '5 meters ahead', direction: 'center', risk: 'low' },
    { id: 4, name: 'Door', confidence: 0.89, distance: '1 meter left', direction: 'left', risk: 'low' },
    { id: 5, name: 'Steps', confidence: 0.78, distance: '4 meters ahead', direction: 'center', risk: 'high' },
  ];

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
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
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
    // In real app, this would use text-to-speech
    Alert.alert('Voice Announcement', `"${objectName}" detected`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
        style={styles.header}
      >
        <Text style={styles.title}>Object Detection</Text>
        <Text style={styles.subtitle}>AI-powered object recognition</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Camera Status */}
        <View style={styles.card}>
          <View style={styles.statusHeader}>
            <View style={styles.statusLeft}>
              <Ionicons name="camera" size={24} color="#8B5CF6" />
              <View style={styles.statusInfo}>
                <Text style={styles.statusTitle}>Camera Status</Text>
                <Text style={styles.statusText}>{cameraStatus}</Text>
              </View>
            </View>
            <View style={[styles.statusDot, { 
              backgroundColor: isConnected ? '#10B981' : '#EF4444' 
            }]} />
          </View>
        </View>

        {/* Detection Controls */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detection Controls</Text>
          
          <View style={styles.controlButtons}>
            <TouchableOpacity
              style={[styles.primaryButton, isDetecting && styles.primaryButtonActive]}
              onPress={isDetecting ? stopDetection : startDetection}
              disabled={!isConnected}
            >
              {isDetecting ? (
                <ActivityIndicator size="small" color="#FFFFFF" style={styles.buttonIcon} />
              ) : (
                <Ionicons 
                  name="eye" 
                  size={20} 
                  color="#FFFFFF" 
                  style={styles.buttonIcon} 
                />
              )}
              <Text style={styles.primaryButtonText}>
                {isDetecting ? 'Stop Detection' : 'Start Detection'}
              </Text>
            </TouchableOpacity>

            <View style={styles.secondaryButtons}>
              <TouchableOpacity style={styles.secondaryButton}>
                <Ionicons name="settings" size={18} color="#8B5CF6" />
                <Text style={styles.secondaryButtonText}>Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={clearHistory}
              >
                <Ionicons name="trash" size={18} color="#8B5CF6" />
                <Text style={styles.secondaryButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Current Detection Results */}
        {detectedObjects.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Current Detection</Text>
              <Text style={styles.objectCount}>{detectedObjects.length} objects</Text>
            </View>
            
            <View style={styles.objectList}>
              {detectedObjects.map((object) => (
                <View key={object.id} style={styles.objectItem}>
                  <View style={styles.objectLeft}>
                    <View style={[styles.objectIcon, { 
                      backgroundColor: `${getRiskColor(object.risk)}20` 
                    }]}>
                      <Ionicons 
                        name="cube" 
                        size={20} 
                        color={getRiskColor(object.risk)} 
                      />
                    </View>
                    
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
                            color={getRiskColor(object.risk)} 
                          />
                          <Text style={[styles.objectDetailText, { 
                            color: getRiskColor(object.risk) 
                          }]}>
                            {object.risk} risk
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.objectRight}>
                    <View style={styles.confidenceContainer}>
                      <Text style={styles.confidenceText}>
                        {Math.round(object.confidence * 100)}%
                      </Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.speakButton}
                      onPress={() => speakObject(object.name)}
                    >
                      <Ionicons name="volume-high" size={16} color="#8B5CF6" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Detection History */}
        {detectionHistory.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Recent Detections</Text>
              <TouchableOpacity onPress={clearHistory}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.historyList} nestedScrollEnabled={true}>
              {detectionHistory.slice(0, 10).map((object, index) => (
                <View key={`${object.id}-${index}`} style={styles.historyItem}>
                  <View style={styles.historyLeft}>
                    <Ionicons name="time" size={14} color="#6B7280" />
                    <Text style={styles.historyTime}>{object.timestamp}</Text>
                  </View>
                  
                  <View style={styles.historyRight}>
                    <Text style={styles.historyObject}>{object.name}</Text>
                    <Text style={styles.historyConfidence}>
                      {Math.round(object.confidence * 100)}%
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Detection Tips */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detection Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons name="sunny" size={20} color="#F59E0B" />
              <Text style={styles.tipText}>
                Better lighting improves detection accuracy
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons name="walk" size={20} color="#10B981" />
              <Text style={styles.tipText}>
                Move slowly for more accurate results
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons name="volume-high" size={20} color="#8B5CF6" />
              <Text style={styles.tipText}>
                Use voice announcements for hands-free operation
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#DDD6FE',
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
  statusInfo: {
    marginLeft: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  controlButtons: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonActive: {
    backgroundColor: '#EF4444',
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    flex: 0.45,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  objectCount: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  objectList: {
    gap: 16,
  },
  objectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  objectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  objectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  objectInfo: {
    flex: 1,
  },
  objectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  objectDistance: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  objectDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  objectDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  objectDetailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  objectRight: {
    alignItems: 'center',
    gap: 8,
  },
  confidenceContainer: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
  },
  speakButton: {
    padding: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  clearText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  historyList: {
    maxHeight: 200,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTime: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  historyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyObject: {
    fontSize: 14,
    color: '#1F2937',
  },
  historyConfidence: {
    fontSize: 12,
    color: '#6B7280',
  },
  tipsList: {
    gap: 16,
    marginTop: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginLeft: 12,
  },
});