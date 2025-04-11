import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"; // Import createStackNavigator
import LoginScreen from "./App/Screen/LoginScreen/LoginScreen";
import HomeScreen from "./App/Screen/HomeScreen/HomeScreen";
import "react-native-gesture-handler";
import ProviderProfile from "./App/Screen/ProviderProfileScreen/ProviderProfile";
import WelcomeScreen from "./App/Screen/WelcomeScreen/WelcomeScreen";
import UserSignInScreen from "/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/App/Screen/UserSignInScreen/UserSignInScreen.js";
import ProviderSignupScreen from "./App/Screen/ProviderSignupScreen/ProviderSignupScreen";
import ClientSignupScreen from "./App/Screen/ClientSignupScreen/ClientSignupScreen";
import ProviderDetailsScreen from "./App/Screen/ProviderDetailsScreen/ProviderDetailsScreen";
import ProvidersServiceSelection from "/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/App/Screen/ProvidersServiceSelectionScreen/ProvidersServiceSelectionScreen.js";
import ProviderHomepage from "./App/Screen/ProviderHomepage/ProviderHomepage";
import EmailConfirmationScreen from "./App/Screen/EmailConfirmationScreen/EmailConfirmationScreen.js";

import ClientMyProfileScreen from "./App/Screen/ClientMyProfileScreen/ClientMyProfileScreen.js";

// Create Stack navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="UserSignInScreen" component={UserSignInScreen} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen
          name="ProviderSignupScreen"
          component={ProviderSignupScreen} // Fixed the typo here
        />
        <Stack.Screen
          name="ProviderDetailsScreen"
          component={ProviderDetailsScreen}
        />
        <Stack.Screen
          name="ProvidersServiceSelection"
          component={ProvidersServiceSelection}
        />
        <Stack.Screen
          name="EmailConfirmationScreen"
          component={EmailConfirmationScreen}
        />
        <Stack.Screen
          name="ClientSignupScreen"
          component={ClientSignupScreen} // Fixed the typo here
        />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />

        <Stack.Screen name="ProviderProfile" component={ProviderProfile} />
        <Stack.Screen name="ProviderHomepage" component={ProviderHomepage} />
        <Stack.Screen
          name="ClientMyProfileScreen"
          component={ClientMyProfileScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
