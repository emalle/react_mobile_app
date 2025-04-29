import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './screens/SignUp';
import LoginScreen from './screens/LogIn';
import HomeScreen from './screens/Home';
import FavoritesScreen from './screens/Favorites';
import SettingsScreen from './screens/Settings';
import { UserProvider } from './UserContext';
import { SQLiteProvider } from './SQLiteContext';


const Stack = createStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <SQLiteProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LogIn">
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen
              name="LogIn"
              component={LoginScreen}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Favorites"
              component={FavoritesScreen}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                headerShown: false
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SQLiteProvider>
    </UserProvider>
  );
}
