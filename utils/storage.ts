import AsyncStorage from '@react-native-async-storage/async-storage';

const CONTACTS_KEY = '@contacts';
const FAVORITES_KEY = '@favorites';

export interface Contact {
  id: {
    value: string;
  };
  name: {
    first: string;
    last: string;
  };
  email: string;
  picture: {
    thumbnail: string;
    medium: string;
    large: string;
  };
  phone: string;
  isFavorite?: boolean;
}

export const saveContacts = async (contacts: Contact[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  } catch (error) {
    console.error('Error saving contacts:', error);
    throw new Error('Failed to save contacts');
  }
};

export const getContacts = async (): Promise<Contact[]> => {
  try {
    const contacts = await AsyncStorage.getItem(CONTACTS_KEY);
    return contacts ? JSON.parse(contacts) : [];
  } catch (error) {
    console.error('Error getting contacts:', error);
    return [];
  }
};

export const toggleFavorite = async (contactId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    const isFavorite = favorites.includes(contactId);
    
    if (isFavorite) {
      const newFavorites = favorites.filter(id => id !== contactId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return false;
    } else {
      const newFavorites = [...favorites, contactId];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw new Error('Failed to update favorite status');
  }
};

export const getFavorites = async (): Promise<string[]> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const isFavorite = async (contactId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.includes(contactId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

export const getFavoriteContacts = async (): Promise<Contact[]> => {
  try {
    const [contacts, favoriteIds] = await Promise.all([
      getContacts(),
      getFavorites()
    ]);
    
    return contacts.filter(contact => favoriteIds.includes(contact.id.value));
  } catch (error) {
    console.error('Error getting favorite contacts:', error);
    return [];
  }
}; 