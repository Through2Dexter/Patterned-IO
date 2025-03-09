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
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ProviderProfile" component={ProviderProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
