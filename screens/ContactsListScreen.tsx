import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ContactCard from '../components/ContactCard';
import { Contact, saveContacts } from '../utils/storage';
import { useTheme } from '../utils/theme';

type RootStackParamList = {
  ContactsList: undefined;
  ContactDetail: { contact: Contact };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ContactsList'>;

const ContactsListScreen = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<NavigationProp>();
  const { isDark } = useTheme();

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [searchQuery, contacts]);

  const filterContacts = () => {
    if (!searchQuery.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = contacts.filter(contact => {
      const fullName = `${contact.name.first} ${contact.name.last}`.toLowerCase();
      return fullName.includes(query);
    });
    setFilteredContacts(filtered);
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch('https://randomuser.me/api/?results=10');
      const data = await response.json();
      const contactsWithIds = data.results.map((contact: Contact, index: number) => ({
        ...contact,
        id: {
          value: contact.id?.value || `contact-${index}-${Date.now()}`
        }
      }));
      setContacts(contactsWithIds);
      setFilteredContacts(contactsWithIds);
      await saveContacts(contactsWithIds);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactPress = (contact: Contact) => {
    navigation.navigate('ContactDetail', { contact });
  };

  if (loading) {
    return (
      <View style={[styles.centered, isDark && styles.darkBackground]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.darkBackground]}>
      <Text style={[styles.title, isDark && styles.darkText]}>Contacts</Text>
      <View style={[styles.searchContainer, isDark && styles.darkSearchContainer]}>
        <Ionicons name="search" size={20} color={isDark ? '#999' : '#666'} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, isDark && styles.darkText]}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={isDark ? '#999' : '#666'}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={isDark ? '#999' : '#666'} />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={filteredContacts}
        renderItem={({ item }) => (
          <ContactCard 
            contact={item} 
            onPress={handleContactPress}
          />
        )}
        keyExtractor={(item) => item.id.value}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, isDark && styles.darkText]}>No contacts found</Text>
          </View>
        )}
      />
    </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  darkSearchContainer: {
    backgroundColor: '#1c1c1e',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
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
  },
});

export default ContactsListScreen; 