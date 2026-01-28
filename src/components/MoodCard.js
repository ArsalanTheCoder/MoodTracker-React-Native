import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';

const MoodCard = ({ item, navigation }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handlePress = () => {
     // --- FIX IS HERE: Uncommented this line ---
     navigation.navigate('MoodDetail', { mood: item });
  };

  // Helper for dynamic colors
  const getIntensityColor = (level) => {
    if (level >= 4) return '#EF4444'; // Red
    if (level === 3) return '#F59E0B'; // Orange
    return '#10B981'; // Green
  };

  const moodColor = getIntensityColor(item.intensity);

  return (
    <TouchableOpacity 
      activeOpacity={1} 
      onPressIn={handlePressIn} 
      onPressOut={handlePressOut} 
      onPress={handlePress}
      style={{ marginBottom: 20 }}
    >
      <Animated.View 
        style={[
          styles.card, 
          { 
            transform: [{ scale: scaleAnim }],
            shadowColor: moodColor,
            shadowOpacity: 0.3,
          }
        ]}
      >
        <LinearGradient
          colors={[Colors.glassBackground, 'rgba(255,255,255,0.02)']}
          style={styles.cardGradient}
        >
            
          {/* Left: Big Emoji */}
          <View style={styles.emojiContainer}>
            <View style={[styles.emojiBg, { backgroundColor: `${moodColor}20`, borderColor: `${moodColor}40` }]}>
              <Text style={styles.emoji}>{item.emoji || '😐'}</Text>
            </View>
          </View>

          {/* Middle: Content */}
          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.moodTitle}>{item.mood}</Text>
              <View style={[styles.dot, { backgroundColor: moodColor }]} />
              <Text style={[styles.intensityText, { color: moodColor }]}>
                Intensity {item.intensity}
              </Text>
            </View>
            
            <Text style={styles.dateText}>
              {/* Ensure date exists before formatting */}
              {item.date ? new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : ''}
            </Text>

            {/* Tags */}
            <View style={styles.tagsRow}>
              {item.tags && item.tags.slice(0, 3).map((tag, i) => (
                <View key={i} style={styles.miniTag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Right: Sleep Stat */}
          <View style={styles.rightStats}>
             <Ionicons name="moon" size={18} color={Colors.textSecondary} />
             <Text style={styles.sleepText}>{item.sleep}h</Text>
          </View>

        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default MoodCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    height: 125,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: '#1E1B4B', 
  },
  cardGradient: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 24,
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  emojiContainer: { marginRight: 18 },
  emojiBg: {
    width: 65, height: 65,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  emoji: { fontSize: 34 },
  contentContainer: { flex: 1, justifyContent: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  moodTitle: { color: Colors.white, fontSize: 20, fontWeight: '700', marginRight: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  intensityText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  dateText: { color: Colors.textSecondary, fontSize: 13, marginBottom: 10 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  miniTag: { 
    backgroundColor: Colors.glassBackground, 
    paddingHorizontal: 8, paddingVertical: 4, 
    borderRadius: 6 
  },
  tagText: { color: Colors.primaryGradientStart, fontSize: 11, fontWeight: '500' },
  rightStats: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: Colors.glassBorder,
    height: '60%',
  },
  sleepText: { color: Colors.white, fontSize: 14, fontWeight: '700', marginTop: 4 },
});