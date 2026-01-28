import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import SplashScreen from '../screens/Onboarding/SplashScreen';
import WelcomeScreen from '../screens/Dashboard/WelcomeScreen';
import AddMoodScreen from '../screens/Moods/AddMoodScreen';
import MoodListScreen from '../screens/Moods/MoodListScreen';
import MoodDetailScreen from '../screens/Moods/MoodDetailScreen';
import AnalyticsScreen from '../screens/Analytics/AnalyticsScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash" // <--- CHANGE THIS TO "Splash"
        screenOptions={{ headerShown: false }}
      >
        
        {/*  Splash Screen */}
        <Stack.Screen name="Splash" component={SplashScreen} />
      
        {/* Add Onboarding Here */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />

        {/*  Dashboard */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />

        {/*  Mood Screens */}
        <Stack.Screen name="AddEntry" component={AddMoodScreen} />
        <Stack.Screen name="MoodList" component={MoodListScreen} />
        <Stack.Screen name="MoodDetail" component={MoodDetailScreen} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}