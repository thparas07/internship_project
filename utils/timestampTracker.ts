import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMESTAMP_KEY = '@contact_timestamps';

interface ContactTimestamp {
  contactId: string;
  lastInteraction: number;
  interactionCount: number;
}

export const recordInteraction = async (contactId: string): Promise<void> => {
  try {
    const timestamps = await getTimestamps();
    const existingTimestamp = timestamps.find(t => t.contactId === contactId);
    
    if (existingTimestamp) {
      existingTimestamp.lastInteraction = Date.now();
      existingTimestamp.interactionCount += 1;
    } else {
      timestamps.push({
        contactId,
        lastInteraction: Date.now(),
        interactionCount: 1,
      });
    }
    
    await AsyncStorage.setItem(TIMESTAMP_KEY, JSON.stringify(timestamps));
  } catch (error) {
    console.error('Error recording interaction:', error);
    throw new Error('Failed to record interaction');
  }
};

export const getTimestamps = async (): Promise<ContactTimestamp[]> => {
  try {
    const timestamps = await AsyncStorage.getItem(TIMESTAMP_KEY);
    return timestamps ? JSON.parse(timestamps) : [];
  } catch (error) {
    console.error('Error getting timestamps:', error);
    return [];
  }
};

export const getContactStats = async (contactId: string): Promise<ContactTimestamp | null> => {
  try {
    const timestamps = await getTimestamps();
    return timestamps.find(t => t.contactId === contactId) || null;
  } catch (error) {
    console.error('Error getting contact stats:', error);
    return null;
  }
}; 