import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors'; 

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Track Your Mood',
    description: 'Log your daily emotions in seconds. Identify patterns and understand yourself better.',
    icon: 'happy-outline',
    color: '#8B5CF6' // Purple
  },
  {
    id: '2',
    title: 'Analyze Trends',
    description: 'Visualize your emotional history with beautiful charts and weekly insights.',
    icon: 'stats-chart-outline',
    color: '#34D399' // Green
  },
  {
    id: '3',
    title: 'Sleep & Health',
    description: 'See how your sleep quality affects your mood. Improve your mental well-being.',
    icon: 'moon-outline',
    color: '#60A5FA' // Blue
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Navigate to Main App
      navigation.replace('Welcome');
    }
  };

  const handleSkip = () => {
    navigation.replace('Welcome');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.background, '#1E1B4B']} style={StyleSheet.absoluteFill} />

      {/* SLIDER */}
      <View style={{ flex: 3 }}>
        <FlatList
          data={SLIDES}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              {/* Icon Circle with Glow */}
              <View style={[styles.iconContainer, { shadowColor: item.color }]}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']}
                  style={styles.iconCircle}
                >
                  <Ionicons name={item.icon} size={80} color={item.color} />
                </LinearGradient>
              </View>
              
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
          onViewableItemsChanged={viewableItemsChanged}
          ref={slidesRef}
        />
      </View>

      {/* FOOTER (Dots + Button) */}
      <View style={styles.footer}>
        
        {/* Paginator Dots */}
        <View style={styles.paginator}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 20, 10],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return <Animated.View key={i} style={[styles.dot, { width: dotWidth, opacity }]} />;
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <LinearGradient
            colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.btnGradient}
          >
            <Text style={styles.btnText}>
              {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        
        {/* Skip Button */}
        {currentIndex < SLIDES.length - 1 && (
            <TouchableOpacity onPress={handleSkip} style={{marginTop: 15}}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  slide: { width, alignItems: 'center', justifyContent: 'center', padding: 20 },
  
  iconContainer: {
    marginBottom: 40,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 180, height: 180,
    borderRadius: 90,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  
  title: { color: Colors.white, fontSize: 32, fontWeight: '800', marginBottom: 15, textAlign: 'center' },
  description: { color: Colors.textSecondary, fontSize: 16, textAlign: 'center', paddingHorizontal: 20, lineHeight: 24 },
  
  footer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  
  paginator: { flexDirection: 'row', height: 64 },
  dot: { height: 10, borderRadius: 5, backgroundColor: Colors.primaryGradientStart, marginHorizontal: 5 },
  
  button: { width: '80%', height: 56, borderRadius: 16, overflow: 'hidden' },
  btnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  skipText: { color: Colors.textSecondary, fontSize: 14, fontWeight: '600' },
});