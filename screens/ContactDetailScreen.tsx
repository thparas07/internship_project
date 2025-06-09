import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Contact, isFavorite, toggleFavorite } from '../utils/storage';

type ContactDetailScreenProps = NativeStackScreenProps<{
  ContactDetail: { contact: Contact };
}, 'ContactDetail'>;

const ContactDetailScreen: React.FC<ContactDetailScreenProps> = ({ route }) => {
  const { contact } = route.params;
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    const status = await isFavorite(contact.id.value);
    setFavorite(status);
  };

  const handleToggleFavorite = async () => {
    try {
      const newStatus = await toggleFavorite(contact.id.value);
      setFavorite(newStatus);
      
      // Show success message
      Alert.alert(
        'Success',
        newStatus 
          ? 'Contact added to favorites' 
          : 'Contact removed from favorites',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: contact.picture.large }} 
          style={styles.avatar}
        />
        <Text style={styles.name}>{`${contact.name.first} ${contact.name.last}`}</Text>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <Ionicons 
            name={favorite ? 'star' : 'star-outline'} 
            size={24} 
            color={favorite ? '#FFD700' : '#666'} 
          />
          <Text style={[styles.favoriteText, favorite && styles.favoriteTextActive]}>
            {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{contact.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{contact.phone}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  favoriteTextActive: {
    color: '#FFD700',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
  },
});

export default ContactDetailScreen; 