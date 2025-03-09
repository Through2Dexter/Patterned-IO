import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import LoginScreen from "./App/Screen/LoginScreen/LoginScreen";
import HomeScreen from "./App/Screen/HomeScreen/HomeScreen";
import "react-native-gesture-handler";
import ProviderProfile from "./App/Screen/ProviderProfileScreen/ProviderProfile";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "./cache";
const Stack = createStackNavigator();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="ProviderProfile" component={ProviderProfile} />
          </Stack.Navigator>
        </NavigationContainer>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
