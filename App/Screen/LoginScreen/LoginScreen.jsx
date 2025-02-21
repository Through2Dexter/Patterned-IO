import React, { useCallback } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../Utils/Colors"; // Ensure this file exists!
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

export default function LoginScreen({ navigation }) {
  // Prevent splash screen from auto-hiding
  SplashScreen.preventAutoHideAsync();

  // Load the font
  let [fontsLoaded] = useFonts({
    "Outfit-Bold": require("../../../Assets/fonts/Outfit-Bold.ttf"),
  });

  // Callback to hide splash screen once fonts are loaded
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Avoid rendering UI until fonts load
  }

  const handleLogin = () => {
    navigation.navigate("HomeScreen"); // Navigate to HomeScreen
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../Assets/Images/logo_.png")}
          style={styles.logoImage}
        />
      </View>
      <View>
        <Text style={styles.heading}>Let's pattern it...</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fedbd0",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 50,
  },
  logoImage: {
    width: 350, // Increased width
    height: 250, // Increased height
    resizeMode: "contain",
  },
  heading: {
    fontSize: 25,
    fontFamily: "Outfit-Bold",
    textAlign: "center",
    marginTop: 20,
    color: Colors.PRIMARY,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 99,
    marginTop: 50,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.WHITE,
    textAlign: "center",
    fontFamily: "Outfit-Bold",
    fontSize: 16, // Slightly larger text
  },
});
