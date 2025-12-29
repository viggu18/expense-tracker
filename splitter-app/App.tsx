import 'react-native-gesture-handler';
import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

import DashboardScreen from './src/screens/DashboardScreen';
import GroupsScreen from './src/screens/GroupsScreen';
import GroupDetailScreen from './src/screens/GroupDetailScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';
import BalancesScreen from './src/screens/BalancesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen'; // Add EditProfileScreen import
import SettingsScreen from './src/screens/SettingsScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import CreateGroupScreen from './src/screens/CreateGroupScreen';
import FriendsScreen from './src/screens/FriendsScreen';
import SelectPeopleScreen from './src/screens/SelectPeopleScreen';
import CategorySelectorScreen from './src/screens/CategorySelectorScreen'; // Add CategorySelectorScreen import

// Import components
import { useStore } from './src/store/useStore';
import { getThemeColors } from './src/services/theme.service';
import FloatingTabBar from './src/components/FloatingTabBar';
import ThemeProvider from './src/components/ThemeProvider';
import { SelectionProvider } from './src/contexts/SelectionContext';

// Create navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigator
function MainTabs() {
  const { darkMode } = useStore();
  const colors = getThemeColors(darkMode);
  return (
    <Tab.Navigator
      tabBar={props => <FloatingTabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBackground },
        headerTintColor: colors.textPrimary,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: undefined, // Icon handled in FloatingTabBar
        }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsScreen}
        options={{
          tabBarIcon: undefined, // Icon handled in FloatingTabBar
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{
          tabBarIcon: undefined, // Icon handled in FloatingTabBar
        }}
      />
      <Tab.Screen
        name="Balances"
        component={BalancesScreen}
        options={{
          tabBarIcon: undefined, // Icon handled in FloatingTabBar
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: undefined, // Icon handled in FloatingTabBar
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { isAuthenticated, setIsAuthenticated, darkMode } = useStore();
  const themeColors = getThemeColors(darkMode);

  // Check if user is logged in on app start
  React.useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuthStatus();
  }, []);

  // Create custom themes that match our app's design
  const CustomLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: themeColors.background,
      card: themeColors.cardBackground,
      text: themeColors.textPrimary,
      border: themeColors.border,
      primary: themeColors.primary,
    },
  };

  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: themeColors.background,
      card: themeColors.cardBackground,
      text: themeColors.textPrimary,
      border: themeColors.border,
      primary: themeColors.primary,
    },
  };

  // Use the appropriate theme based on darkMode setting
  const theme = darkMode ? CustomDarkTheme : CustomLightTheme;

  return (
    <SelectionProvider>
      <ThemeProvider>
        <NavigationContainer theme={theme}>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: themeColors.headerBackground },
              headerTintColor: themeColors.textPrimary,
              contentStyle: { backgroundColor: themeColors.background },
            }}
          >
            {isAuthenticated ? (
              <>
                <Stack.Screen
                  name="Main"
                  component={MainTabs}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="GroupDetail"
                  component={GroupDetailScreen}
                  options={{ title: 'Group Details' }}
                />
                <Stack.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={{ title: 'Settings' }}
                />
                <Stack.Screen
                  name="Friends"
                  component={FriendsScreen}
                  options={{ title: 'Friends' }}
                />
                <Stack.Screen
                  name="EditProfile"
                  component={EditProfileScreen}
                  options={{ title: 'Edit Profile' }}
                />
                <Stack.Screen
                  name="AddExpense"
                  component={AddExpenseScreen}
                  options={{ title: 'Add Expense' }}
                />
                <Stack.Screen
                  name="CategorySelector"
                  component={CategorySelectorScreen}
                  options={{ title: 'Select Category' }}
                />
                <Stack.Screen
                  name="CreateGroup"
                  component={CreateGroupScreen}
                  options={{ title: 'Create Group' }}
                />
                <Stack.Screen
                  name="SelectPeople"
                  component={SelectPeopleScreen}
                  options={{ title: 'Select People', headerShown: false }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Register"
                  component={RegisterScreen}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SelectionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
