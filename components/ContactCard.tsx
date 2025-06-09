import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Contact } from '../utils/storage';
import { useTheme } from '../utils/theme';

interface ContactCardProps {
  contact: Contact;
  onPress?: (contact: Contact) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onPress }) => {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, isDark && styles.darkContainer]}
      onPress={() => onPress?.(contact)}
    >
      <Image 
        source={{ uri: contact.picture.thumbnail }} 
        style={styles.avatar}
      />
      <View style={styles.content}>
        <Text style={[styles.name, isDark && styles.darkText]}>{`${contact.name.first} ${contact.name.last}`}</Text>
        <Text style={[styles.email, isDark && styles.darkSubtext]}>{contact.email}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  darkContainer: {
    backgroundColor: '#1c1c1e',
    shadowColor: '#fff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  darkSubtext: {
    color: '#999',
  },
});

export default ContactCard; 