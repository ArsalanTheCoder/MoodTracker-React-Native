import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { subscribeToMoods } from '../../services/moodService'; 
import MoodCard from '../../components/MoodCard'; 

export default function MoodListScreen({ navigation }) {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToMoods((data) => {
      // Sort by newest first
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMoods(sortedData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Header Component
  const ListHeader = () => (
    <View style={styles.listHeaderContainer}>
        <View>
            <Text style={styles.greetingText}>Welcome Back,</Text>
            <Text style={styles.headerTitle}>Recent Logs</Text>
        </View>
        
        <TouchableOpacity 
            style={styles.analyticsButton}
            onPress={() => navigation.navigate('Analytics')}
        >
            <LinearGradient
                colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
                style={styles.analyticsGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
                <Ionicons name="stats-chart" size={16} color={Colors.white} style={{marginRight: 6}} />
                <Text style={styles.analyticsText}>View Charts</Text>
            </LinearGradient>
        </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient colors={[Colors.background, '#1E1B4B']} style={StyleSheet.absoluteFill} />

      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={Colors.primaryGradientStart} />
        </View>
      ) : (
        <FlatList
          data={moods}
          keyExtractor={(item) => item.id || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <MoodCard item={item} navigation={navigation} />}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="journal-outline" size={50} color={Colors.teal} />
              </View>
              <Text style={styles.emptyText}>No entries yet</Text>
              <Text style={styles.emptySubtext}>Tap "+" to track your first mood!</Text>
            </View>
          }
        />
      )}

      {/* FAB (Floating Button) */}
      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.8} 
        onPress={() => navigation.navigate('AddEntry')}
      >
        <LinearGradient 
            colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]} 
            style={styles.fabGradient}
        >
          <Ionicons name="add" size={36} color={Colors.white} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 20, paddingBottom: 100, paddingTop: 50 }, 
  
  // Header
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  greetingText: { color: Colors.textSecondary, fontSize: 14, fontWeight: '600' },
  headerTitle: { color: Colors.white, fontSize: 28, fontWeight: '800' },
  
  // Analytics Button
  analyticsButton: {
    borderRadius: 12,
    shadowColor: Colors.primaryGradientStart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  analyticsGradient: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  analyticsText: { color: Colors.white, fontWeight: 'bold', fontSize: 12 },

  // Empty State
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyIconBg: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.glassBackground,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1, borderColor: Colors.glassBorder
  },
  emptyText: { color: Colors.white, fontSize: 20, fontWeight: '700' },
  emptySubtext: { color: Colors.textSecondary, marginTop: 8, fontSize: 14 },

  // FAB
  fab: {
    position: 'absolute', bottom: 30, right: 20,
    width: 64, height: 64, borderRadius: 32,
    shadowColor: Colors.primaryGradientStart, 
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5, shadowRadius: 10, elevation: 10,
  },
  fabGradient: { flex: 1, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
});