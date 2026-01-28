import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// 1. IMPORTS
import Colors from '../../constants/colors';
import { deleteMoodEntry } from '../../services/moodService'; 

export default function MoodDetailScreen({ route, navigation }) {
  const { mood } = route.params || {};
  const [isDeleting, setIsDeleting] = useState(false);

  if (!mood) return null;

  const getIntensityColor = (level) => {
    if (level >= 4) return '#EF4444'; // Red (Danger/High)
    if (level === 3) return '#F59E0B'; // Orange (Medium)
    return '#10B981'; // Green (Good)
  };

  // --- DELETE LOGIC ---
  const handleDelete = () => {
    Alert.alert(
      "Delete Memory?",
      "This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
             setIsDeleting(true);
             try {
               await deleteMoodEntry(mood.id);
               setIsDeleting(false);
               navigation.goBack(); 
             } catch (error) {
               setIsDeleting(false);
               Alert.alert("Error", "Could not delete. Check your connection.");
             }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.background, '#1E1B4B']} style={styles.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <View style={[
              styles.emojiCircle, 
              { shadowColor: getIntensityColor(mood.intensity) }
          ]}>
            <Text style={styles.emoji}>{mood.emoji}</Text>
          </View>
          <Text style={styles.moodTitle}>{mood.mood}</Text>
          <Text style={styles.dateText}>
            {/* Handle both date string formats if necessary */}
            {mood.dateString || new Date(mood.date).toLocaleDateString()} • {mood.timeString || new Date(mood.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>

        {/* STATS GRID */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>INTENSITY</Text>
            <Text style={[styles.statValue, { color: getIntensityColor(mood.intensity) }]}>
              {mood.intensity}/5
            </Text>
            <View style={styles.intensityTrack}>
              <View 
                style={[
                  styles.intensityFill, 
                  { 
                    width: `${(mood.intensity / 5) * 100}%`, 
                    backgroundColor: getIntensityColor(mood.intensity) 
                  }
                ]} 
              />
            </View>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>SLEEP</Text>
            <View style={styles.sleepRow}>
              <Ionicons name="moon" size={24} color={Colors.teal} />
              <Text style={styles.statValue}>{mood.sleep}h</Text>
            </View>
            <Text style={styles.statSubtext}>Hours Slept</Text>
          </View>
        </View>

        {/* TAGS */}
        {mood.tags && mood.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONTEXT</Text>
            <View style={styles.tagsRow}>
              {mood.tags.map((tag, index) => (
                <View key={index} style={styles.tagChip}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* NOTES */}
        {mood.note ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>REFLECTION</Text>
            <View style={styles.noteCard}>
              <Ionicons name="chatbox-ellipses-outline" size={24} color="rgba(255,255,255,0.2)" style={{marginBottom: 8}} />
              <Text style={styles.noteText}>"{mood.note}"</Text>
            </View>
          </View>
        ) : null}

        <View style={{height: 50}} />
        
        {/* DELETE BUTTON */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={isDeleting}>
          {isDeleting ? (
            <ActivityIndicator color="#EF4444" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={20} color="#EF4444" style={{marginRight: 8}} />
              <Text style={styles.deleteText}>Delete Entry</Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  header: { paddingTop: 50, paddingHorizontal: 20, alignItems: 'flex-end' }, 
  closeButton: { 
    width: 40, height: 40, 
    borderRadius: 20, 
    backgroundColor: Colors.glassBackground, 
    alignItems: 'center', justifyContent: 'center' 
  },
  scrollContent: { padding: 24 },
  
  // Hero
  heroSection: { alignItems: 'center', marginBottom: 40 },
  emojiCircle: { 
    width: 100, height: 100, 
    borderRadius: 50, 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderWidth: 1, 
    borderColor: Colors.glassBorder, 
    alignItems: 'center', justifyContent: 'center', 
    marginBottom: 16, 
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 0.6, 
    shadowRadius: 20 
  },
  emoji: { fontSize: 50 },
  moodTitle: { fontSize: 32, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  dateText: { color: Colors.textSecondary, fontSize: 14 },
  
  // Stats
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statCard: { 
    width: '48%', 
    backgroundColor: Colors.glassBackground, 
    borderRadius: 20, 
    padding: 16, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: Colors.glassBorder 
  },
  statLabel: { 
    color: '#64748B', 
    fontSize: 10, 
    fontWeight: 'bold', 
    letterSpacing: 1, 
    marginBottom: 8 
  },
  statValue: { fontSize: 24, fontWeight: '700', color: Colors.white, marginBottom: 8 },
  intensityTrack: { 
    width: '100%', height: 6, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    borderRadius: 3, 
    overflow: 'hidden' 
  },
  intensityFill: { height: '100%', borderRadius: 3 },
  sleepRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  statSubtext: { color: '#64748B', fontSize: 10 },
  
  // Tags
  section: { marginBottom: 30 },
  sectionTitle: { 
    color: '#94A3B8', 
    fontSize: 12, 
    fontWeight: '700', 
    marginBottom: 12, 
    marginLeft: 4 
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: { 
    backgroundColor: 'rgba(139, 92, 246, 0.15)', 
    paddingHorizontal: 12, paddingVertical: 6, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: 'rgba(139, 92, 246, 0.3)' 
  },
  tagText: { color: Colors.primaryGradientStart, fontSize: 13, fontWeight: '600' },
  
  // Notes
  noteCard: { 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    padding: 20, 
    borderRadius: 16, 
    borderLeftWidth: 4, 
    borderLeftColor: Colors.primaryGradientEnd 
  },
  noteText: { color: Colors.textSecondary, fontSize: 15, fontStyle: 'italic', lineHeight: 24 },
  
  // Delete
  deleteButton: { 
    flexDirection: 'row', 
    alignItems: 'center', justifyContent: 'center', 
    padding: 16, 
    backgroundColor: 'rgba(239, 68, 68, 0.1)', 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: 'rgba(239, 68, 68, 0.2)' 
  },
  deleteText: { color: '#EF4444', fontWeight: '600', fontSize: 15 },
});