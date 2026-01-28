import * as React from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/colors'; 
import GradientButton from '../../components/GradientButton';
import GlassButton from '../../components/GlassButton';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const moveAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1200, easing: Easing.out(Easing.exp), useNativeDriver: true }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(moveAnim, { toValue: 10, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(moveAnim, { toValue: -10, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ position: 'absolute', width: width * 1.5, height: height * 1.5, transform: [{ translateY: moveAnim }] }}>
        <LinearGradient
          colors={Colors.bgGradient} // Use Constant Gradient
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        />
      </Animated.View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        
        <View style={styles.iconContainer}>
            <Ionicons name="happy-outline" size={60} color={Colors.white} />
        </View>
        <Text style={styles.logo}>MoodTracker</Text>
        <Text style={styles.subtitle}>
          Track your daily emotions, identify patterns, and improve your mental well-being.
        </Text>

        <GradientButton 
          title="Log New Mood" 
          icon="add-circle-outline" 
          onPress={() => navigation.navigate('AddEntry')} 
        />

        <GlassButton 
          title="Daily Log" 
          icon="list-outline" 
          onPress={() => navigation.navigate('MoodList')} 
        />

        <TouchableOpacity 
          style={styles.tertiaryButton} 
          onPress={() => navigation.navigate('Analytics')}
        >
          <Ionicons name="stats-chart-outline" size={20} color={Colors.teal} style={{marginRight: 8}} />
          <Text style={styles.tertiaryBtnText}>View Analytics</Text>
        </TouchableOpacity>

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
  gradientBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: width,
    opacity: 0.6,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  iconContainer: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: Colors.glassBackground, // Use Constant
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logo: {
    fontSize: 38,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 10,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    opacity: 0.9,
  },
  tertiaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.teal, // Use Constant
    marginTop: 4,
  },
  tertiaryBtnText: {
    color: Colors.teal, // Use Constant
    fontWeight: '700',
    fontSize: 16,
  },
});