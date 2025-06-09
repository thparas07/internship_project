import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import ContactCard from '../components/ContactCard';
import { Contact, getFavoriteContacts } from '../utils/storage';

type RootStackParamList = {
  FavoritesList: undefined;
  ContactDetail: { contact: Contact };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'FavoritesList'>;

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const favoriteContacts = await getFavoriteContacts();
      // Ensure each contact has a unique ID
      const contactsWithIds = favoriteContacts.map((contact: Contact, index: number) => ({
        ...contact,
        id: {
          value: contact.id?.value || `favorite-${index}-${Date.now()}`
        }
      }));
      setFavorites(contactsWithIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Failed to load favorite contacts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh favorites when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const handleContactPress = (contact: Contact) => {
    navigation.navigate('ContactDetail', { contact });
  };

  const handleExport = async () => {
    try {
      const exportData = favorites.map(contact => ({
        name: `${contact.name.first} ${contact.name.last}`,
        email: contact.email,
        phone: contact.phone
      }));

      const fileUri = `${FileSystem.documentDirectory}favorites.json`;
      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(exportData, null, 2)
      );

      Alert.alert(
        'Success',
        `Favorites exported to: ${fileUri}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error exporting favorites:', error);
      Alert.alert('Error', 'Failed to export favorites');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        {favorites.length > 0 && (
          <TouchableOpacity 
            style={styles.exportButton}
            onPress={handleExport}
          >
            <Ionicons name="download-outline" size={24} color="#007AFF" />
            <Text style={styles.exportText}>Export</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <ContactCard 
            contact={item} 
            onPress={handleContactPress}
          />
        )}
        keyExtractor={(item) => item.id.value}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="star-outline" size={48} color="#666" />
            <Text style={styles.emptyText}>No favorite contacts yet</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
  },
  exportText: {
    marginLeft: 4,
    color: '#007AFF',
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});

export default FavoritesScreen; 