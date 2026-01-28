import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors'; 

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6, 
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(1500), 
    ]).start(() => {
        navigation.replace('Onboarding');
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={Colors.bgGradient} 
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }}
      />
      
      <Animated.View 
        style={{ 
          opacity: fadeAnim, 
          transform: [{ scale: scaleAnim }], 
          alignItems: 'center' 
        }}
      >
        
        <View style={styles.iconCircle}>
           <Ionicons name="happy-outline" size={80} color={Colors.white} />
        </View>

        {/* App Name */}
        <Animated.Text style={styles.text}>MoodTracker</Animated.Text>
        <Text style={styles.subText}>Your Daily Journal</Text>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  logo: {
    width: 150,  
    height: 150,
    marginBottom: 15,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.primaryGradientStart,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  text: {
    color: Colors.white,
    fontSize: 38,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  subText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 5,
    letterSpacing: 1,
    opacity: 0.8,
  }
});