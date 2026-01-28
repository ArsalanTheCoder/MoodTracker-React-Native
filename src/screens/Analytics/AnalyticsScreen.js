import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { subscribeToMoods } from '../../services/moodService'; 

const screenWidth = Dimensions.get('window').width;

const getLocalYYYYMMDD = (dateInput) => {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function AnalyticsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    trends: [0, 0, 0, 0, 0, 0, 0],
    distribution: [],
    sleep: [0, 0, 0, 0, 0, 0, 0]
  });

  useEffect(() => {
    const unsubscribe = subscribeToMoods((moods) => {
      
      // 1. SETUP: Last 7 days ke liye buckets banao
      const last7DaysKeys = [];
      const dayLabels = [];
      const intensityMap = {}; 
      const sleepMap = {};     

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        
        const dateKey = getLocalYYYYMMDD(d);
        
        last7DaysKeys.push(dateKey);
        dayLabels.push(d.toLocaleDateString('en-US', { weekday: 'short' })); 
        
        intensityMap[dateKey] = [];
        sleepMap[dateKey] = [];
      }

      moods.forEach(m => {
        if (m.date || m.fullDate) {
            const entryKey = getLocalYYYYMMDD(m.date || m.fullDate);
            
            if (intensityMap[entryKey]) {
                intensityMap[entryKey].push(m.intensity || 0);
                sleepMap[entryKey].push(m.sleep || 0);
            }
        }
      });

      // 3. CALCULATE AVERAGES
      const trendData = last7DaysKeys.map(dateKey => {
        const values = intensityMap[dateKey];
        if (values.length === 0) return 0;
        const sum = values.reduce((a, b) => a + b, 0);
        return sum / values.length;
      });

      const sleepData = last7DaysKeys.map(dateKey => {
        const values = sleepMap[dateKey];
        if (values.length === 0) return 0;
        const sum = values.reduce((a, b) => a + b, 0);
        return sum / values.length;
      });

      // 4. PIE CHART DATA
      const counts = {};
      moods.forEach(m => { 
          if(m.mood) counts[m.mood] = (counts[m.mood] || 0) + 1; 
      });

      const pieData = Object.keys(counts).map((key) => {
        let color = '#9CA3AF';
        if (key === 'Happy') color = '#10B981';
        if (key === 'Calm') color = '#60A5FA';
        if (key === 'Sad') color = '#8B5CF6';
        if (key === 'Angry') color = '#EF4444';
        if (key === 'Neutral') color = '#F59E0B';
        if (key === 'Anxious') color = '#A78BFA';

        return {
          name: key,
          population: counts[key],
          color: color,
          legendFontColor: "#E0E7FF",
          legendFontSize: 12
        };
      });

      setChartData({
        labels: dayLabels,
        trends: trendData,
        sleep: sleepData,
        distribution: pieData
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const chartConfig = {
    backgroundGradientFrom: "#1E1B4B",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#1E1B4B",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(167, 139, 250, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0, 
    propsForDots: { r: "4", strokeWidth: "2", stroke: "#8B5CF6" },
    fillShadowGradient: '#8B5CF6',
    fillShadowGradientOpacity: 0.3,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color="#fff"/></View>;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#1E1B4B']} style={styles.background} />
      
      {/* --- UPDATED HEADER WITH BACK BUTTON --- */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        
        <View>
            <Text style={styles.title}>Your Insights</Text>
            <Text style={styles.subtitle}>Last 7 Days Analysis</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. EMOTIONAL TREND */}
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Ionicons name="pulse-outline" size={20} color="#A78BFA" />
                <Text style={styles.cardTitle}>Emotional Intensity</Text>
            </View>
            <LineChart
                data={{
                    labels: chartData.labels,
                    datasets: [{ 
                        data: chartData.trends.length ? chartData.trends : [0,0,0,0,0,0,0] 
                    }]
                }}
                width={screenWidth - 48}
                height={220}
                yAxisInterval={1}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                fromZero
                withInnerLines={false}
            />
        </View>

        {/* 2. PIE CHART */}
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Ionicons name="pie-chart-outline" size={20} color="#60A5FA" />
                <Text style={styles.cardTitle}>Mood Personality</Text>
            </View>
            {chartData.distribution.length > 0 ? (
                <PieChart
                    data={chartData.distribution}
                    width={screenWidth - 48}
                    height={200}
                    chartConfig={chartConfig}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    center={[10, 0]}
                    absolute
                />
            ) : <Text style={styles.noData}>Log more data to see chart</Text>}
        </View>

        {/* 3. SLEEP CHART */}
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Ionicons name="bed-outline" size={20} color="#34D399" />
                <Text style={styles.cardTitle}>Sleep Hours</Text>
            </View>
            <BarChart
                data={{
                    labels: chartData.labels,
                    datasets: [{ 
                        data: chartData.sleep.length ? chartData.sleep : [0,0,0,0,0,0,0] 
                    }]
                }}
                width={screenWidth - 48}
                height={220}
                yAxisSuffix="h"
                chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => `rgba(52, 211, 153, ${opacity})`,
                    fillShadowGradient: '#34D399',
                }}
                style={styles.chart}
                showValuesOnTopOfBars
                fromZero
                withInnerLines={false}
            />
        </View>

        <View style={{height: 50}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  center: { flex: 1, backgroundColor:'#0F172A', alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 24, paddingTop: 10 },
  
  headerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20,
    marginTop: 40, 
    paddingHorizontal: 20
  },
  backButton: { 
    marginRight: 15,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12
  },
  title: { fontSize: 24, fontWeight: '800', color: '#fff' }, 
  subtitle: { fontSize: 14, color: '#94A3B8' },
  
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden'
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardTitle: { color: '#fff', fontWeight: '700', fontSize: 16, marginLeft: 8 },
  chart: { marginVertical: 8, borderRadius: 16, paddingRight: 0 },
  noData: { color: '#94A3B8', textAlign: 'center', margin: 20 }
});