// App.tsx
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Contact } from './utils/storage';
import { ThemeProvider, useTheme } from './utils/theme';
import ThemeToggle from './components/ThemeToggle';

import ContactsListScreen from './screens/ContactsListScreen';
import ContactDetailScreen from './screens/ContactDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import StatsScreen from './screens/StatsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<{
  ContactsList: undefined;
  FavoritesList: undefined;
  ContactDetail: { contact: Contact };
}>();

const ContactsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ContactsList" 
        component={ContactsListScreen}
        options={{ 
          title: 'Contacts',
          headerRight: () => <ThemeToggle />
        }}
      />
      <Stack.Screen 
        name="ContactDetail" 
        component={ContactDetailScreen}
        options={{ title: 'Contact Details' }}
      />
    </Stack.Navigator>
  );
};

const FavoritesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="FavoritesList" 
        component={FavoritesScreen}
        options={{ 
          title: 'Favorites',
          headerRight: () => <ThemeToggle />
        }}
      />
      <Stack.Screen 
        name="ContactDetail" 
        component={ContactDetailScreen}
        options={{ title: 'Contact Details' }}
      />
    </Stack.Navigator>
  );
};

const NavigationContent = () => {
  const { isDark } = useTheme();

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Contacts') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Favorites') {
              iconName = focused ? 'star' : 'star-outline';
            } else if (route.name === 'Stats') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            }

            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Contacts" 
          component={ContactsStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Favorites" 
          component={FavoritesStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Stats" 
          component={StatsScreen}
          options={{
            headerRight: () => <ThemeToggle />
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContent />
    </ThemeProvider>
  );
}