import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../utils/theme';
import { getContacts, getFavorites } from '../utils/storage';
import { getTimestamps } from '../utils/timestampTracker';
import Graph from '../components/Graph';

const StatsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalFavorites: 0,
    mostInteracted: 0,
    lastWeekInteractions: 0
  });
  const [graphData, setGraphData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
  });
  const { isDark } = useTheme();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [contacts, favorites, timestamps] = await Promise.all([
        getContacts(),
        getFavorites(),
        getTimestamps()
      ]);

      // Calculate weekly interaction data
      const now = Date.now();
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
      const weeklyData = new Array(7).fill(0);
      
      timestamps.forEach(timestamp => {
        const date = new Date(timestamp.lastInteraction);
        const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const adjustedIndex = (dayIndex + 6) % 7; // Convert to Monday-based week
        weeklyData[adjustedIndex]++;
      });

      // Find most interacted contact
      const mostInteracted = Math.max(...timestamps.map(t => t.interactionCount), 0);

      // Count last week interactions
      const lastWeekInteractions = timestamps.filter(t => t.lastInteraction >= oneWeekAgo).length;

      setStats({
        totalContacts: contacts.length,
        totalFavorites: favorites.length,
        mostInteracted,
        lastWeekInteractions
      });

      setGraphData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{ data: weeklyData }]
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      Alert.alert('Error', 'Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, isDark && styles.darkBackground]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, isDark && styles.darkBackground]}>
      <Text style={[styles.title, isDark && styles.darkText]}>Statistics</Text>
      
      <View style={[styles.card, isDark && styles.darkCard]}>
        <Text style={[styles.cardTitle, isDark && styles.darkText]}>Weekly Interactions</Text>
        <Graph data={graphData} />
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statItem, isDark && styles.darkCard]}>
          <Text style={[styles.statValue, isDark && styles.darkText]}>{stats.totalContacts}</Text>
          <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>Total Contacts</Text>
        </View>
        
        <View style={[styles.statItem, isDark && styles.darkCard]}>
          <Text style={[styles.statValue, isDark && styles.darkText]}>{stats.totalFavorites}</Text>
          <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>Favorites</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statItem, isDark && styles.darkCard]}>
          <Text style={[styles.statValue, isDark && styles.darkText]}>{stats.mostInteracted}</Text>
          <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>Most Interactions</Text>
        </View>
        
        <View style={[styles.statItem, isDark && styles.darkCard]}>
          <Text style={[styles.statValue, isDark && styles.darkText]}>{stats.lastWeekInteractions}</Text>
          <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>Last Week</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  darkBackground: {
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#999',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#1c1c1e',
    shadowColor: '#fff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StatsScreen; 