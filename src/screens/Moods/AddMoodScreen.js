import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, 
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/colors';
import { addMoodEntry } from '../../services/moodService'; 

export default function AddMoodScreen({ navigation }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [sleepHours, setSleepHours] = useState(7);
  const [selectedTags, setSelectedTags] = useState([]);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const moods = [
    { label: 'Happy', icon: '😄', color: '#10B981' },
    { label: 'Calm', icon: '😌', color: '#60A5FA' },
    { label: 'Neutral', icon: '😐', color: '#9CA3AF' },
    { label: 'Sad', icon: '😔', color: '#8B5CF6' },
    { label: 'Angry', icon: '😡', color: '#EF4444' },
  ];

  const tags = ['Work', 'Family', 'Date', 'Exercise', 'Food', 'Sleep', 'Study', 'Social'];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(t => t !== tag));
    else setSelectedTags([...selectedTags, tag]);
  };

  const handleSave = async () => {
    if (!selectedMood) {
      Alert.alert('Missing Mood', 'Please select a mood emoji.');
      return;
    }

    setIsSaving(true); 

    const moodData = {
      mood: selectedMood,
      emoji: moods.find(m => m.label === selectedMood)?.icon,
      intensity,
      sleep: sleepHours,
      tags: selectedTags,
      note: note.trim(),
      date: new Date().toISOString(), 
    };

    try {
      await addMoodEntry(moodData);
      setIsSaving(false);
      navigation.goBack(); 
    } catch (error) {
      setIsSaving(false);
      Alert.alert("Error", "Could not save entry. Check internet connection.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient 
        colors={[Colors.background, '#1E1B4B']} 
        style={styles.background} 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Entry</Text>
        <View style={styles.dateBadge}>
          <Ionicons name="calendar-outline" size={14} color={Colors.teal} />
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Moods */}
          <Text style={styles.sectionLabel}>How are you feeling?</Text>
          <View style={styles.moodGrid}>
            {moods.map((m) => (
              <TouchableOpacity
                key={m.label}
                style={[
                    styles.moodButton, 
                    selectedMood === m.label && { backgroundColor: m.color, borderColor: m.color }
                ]}
                onPress={() => setSelectedMood(m.label)}
              >
                <Text style={styles.moodEmoji}>{m.icon}</Text>
                <Text style={[
                    styles.moodLabel, 
                    selectedMood === m.label && { color: Colors.white, fontWeight: 'bold' }
                ]}>
                    {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Intensity & Sleep */}
          <View style={styles.rowContainer}>
            <View style={styles.halfCard}>
              <Text style={styles.cardLabel}>Intensity</Text>
              <View style={styles.intensityRow}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                        styles.intensityCircle, 
                        intensity >= level && { backgroundColor: Colors.primaryGradientStart }
                    ]}
                    onPress={() => setIntensity(level)}
                  >
                    <Text style={styles.intensityText}>{level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.halfCard}>
              <Text style={styles.cardLabel}>Sleep</Text>
              <View style={styles.counterRow}>
                <TouchableOpacity onPress={() => setSleepHours(Math.max(0, sleepHours - 1))}>
                    <Ionicons name="remove" size={24} color={Colors.white} />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{sleepHours}h</Text>
                <TouchableOpacity onPress={() => setSleepHours(Math.min(24, sleepHours + 1))}>
                    <Ionicons name="add" size={24} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Tags */}
          <Text style={styles.sectionLabel}>What's happening?</Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                    styles.tagChip, 
                    selectedTags.includes(tag) && styles.tagChipSelected
                ]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={[
                    styles.tagText, 
                    selectedTags.includes(tag) && styles.tagTextSelected
                ]}>
                    {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Notes */}
          <Text style={styles.sectionLabel}>Notes</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Write a brief reflection..."
            placeholderTextColor="#64748B"
            multiline
            value={note}
            onChangeText={setNote}
          />
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
          <LinearGradient 
            colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]} 
            style={styles.gradientBtn}
          >
            {isSaving ? (
                <ActivityIndicator color={Colors.white} />
            ) : (
                <Text style={styles.saveBtnText}>Save Entry</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 20, 
    paddingTop: 50 
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: Colors.white },
  dateBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Colors.glassBackground, 
    padding: 8, 
    borderRadius: 20 
  },
  dateText: { color: Colors.textSecondary, marginLeft: 6, fontSize: 12 },
  scrollContent: { padding: 20 },
  sectionLabel: { 
    color: '#A5B4FC', 
    fontSize: 12, 
    fontWeight: 'bold', 
    marginTop: 15, 
    marginBottom: 10, 
    letterSpacing: 1 
  },
  
  // Mood Grid
  moodGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  moodButton: { 
    width: 60, height: 70, 
    alignItems: 'center', justifyContent: 'center', 
    borderRadius: 16, 
    backgroundColor: Colors.glassBackground, 
    borderWidth: 1, 
    borderColor: Colors.glassBorder 
  },
  moodEmoji: { fontSize: 28 },
  moodLabel: { fontSize: 10, color: '#94A3B8', marginTop: 4 },
  
  // Cards
  rowContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  halfCard: { 
    width: '48%', 
    backgroundColor: Colors.glassBackground, 
    borderRadius: 16, 
    padding: 15 
  },
  cardLabel: { 
    color: Colors.textSecondary, 
    fontSize: 13, 
    fontWeight: '600', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  
  // Intensity
  intensityRow: { flexDirection: 'row', justifyContent: 'space-between' },
  intensityCircle: { 
    width: 24, height: 24, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    alignItems: 'center', justifyContent: 'center' 
  },
  intensityText: { color: Colors.white, fontSize: 10, fontWeight: 'bold' },
  
  // Sleep
  counterRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.2)', 
    borderRadius: 12, 
    padding: 4 
  },
  counterValue: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  
  // Tags
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tagChip: { 
    paddingVertical: 8, paddingHorizontal: 14, 
    borderRadius: 20, 
    backgroundColor: Colors.glassBackground, 
    borderWidth: 1, 
    borderColor: Colors.glassBorder 
  },
  tagChipSelected: { 
    backgroundColor: 'rgba(139, 92, 246, 0.2)', 
    borderColor: Colors.primaryGradientStart 
  },
  tagText: { color: '#94A3B8', fontSize: 13 },
  tagTextSelected: { color: Colors.textSecondary, fontWeight: '600' },
  
  // Input
  textInput: { 
    backgroundColor: Colors.glassBackground, 
    borderRadius: 16, 
    padding: 15, 
    color: Colors.white, 
    fontSize: 15, 
    minHeight: 100, 
    textAlignVertical: 'top' 
  },
  
  // Footer
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    padding: 20, 
    backgroundColor: Colors.background, 
    borderTopWidth: 1, 
    borderTopColor: Colors.glassBorder 
  },
  saveButton: { width: '100%', height: 56, borderRadius: 16, overflow: 'hidden' },
  gradientBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: Colors.white, fontSize: 18, fontWeight: 'bold' },
});