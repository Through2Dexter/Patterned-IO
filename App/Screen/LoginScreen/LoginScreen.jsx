import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../Utils/Colors";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

export default function LoginScreen({ navigation }) {
  // Prevent splash screen from auto-hiding
  useEffect(() => {
    SplashScreen.preventAutoHideAsync(); // Call this once at component mount
    return () => {
      SplashScreen.hideAsync(); // Ensure splash screen hides when the component unmounts
    };
  }, []);

  // Load the font
  let [fontsLoaded] = useFonts({
    "Outfit-Bold": require("../../../Assets/fonts/Outfit-Bold.ttf"),
  });

  const [isPressed, setIsPressed] = useState(false);

  const handleLogin = () => {
    navigation.navigate("HomeScreen");
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Wait for fonts to load before rendering the UI
  if (!fontsLoaded) {
    return null;
  }

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

        {/* Apple Login Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          activeOpacity={0.7} // Light overlay effect on press
        >
          <Text style={styles.buttonText}>Login with Apple</Text>
        </TouchableOpacity>

        {/* Google Login Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          activeOpacity={0.7} // Light overlay effect on press
        >
          <Text style={styles.buttonText}>Login with Google</Text>
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
    width: 350,
    height: 250,
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
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "Outfit-Bold",
    fontSize: 16,
    color: Colors.WHITE,
  },
});
