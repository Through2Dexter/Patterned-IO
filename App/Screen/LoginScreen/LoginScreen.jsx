import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import Colors from "../../Utils/Colors";
import { useFonts } from "expo-font";

export default function LoginScreen({ navigation }) {
  const [isPressed, setIsPressed] = useState(null); // Track which button is pressed
  const [fontsLoaded] = useFonts({
    "Outfit-Bold": require("../../../Assets/fonts/Outfit-Bold.ttf"),
  });

  const logoTranslateY = new Animated.Value(100); // Controls logo movement from bottom
  const buttonsOpacity = new Animated.Value(0); // Controls buttons fade-in

  // Run animations once fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      // Animate the logo from bottom to center
      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      // Animate buttons to fade in after logo animation
      Animated.timing(buttonsOpacity, {
        toValue: 1,
        duration: 500,
        delay: 1200, // Wait for logo animation to complete
        useNativeDriver: true,
      }).start();
    }
  }, [fontsLoaded]); // Re-run animation only after fonts are loaded

  // Wait for fonts to load before rendering the UI
  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Temporary loading text to check if font is loaded
  }

  return (
    <View style={styles.container}>
      {/* Logo with animation */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ translateY: logoTranslateY }],
          },
        ]}
      >
        <Image
          source={require("../../../Assets/Images/logo_.png")}
          style={styles.logoImage}
        />
      </Animated.View>

      {/* Heading */}
      <Text style={styles.heading}>Let's pattern it...</Text>

      {/* Buttons with fade-in animation */}
      <Animated.View style={{ opacity: buttonsOpacity }}>
        {/* Apple Login Button */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                isPressed === "apple" ? Colors.WHITE : Colors.PRIMARY,
              borderWidth: 2,
              borderColor: Colors.PRIMARY,
            },
          ]}
          onPress={() => {
            navigation.navigate("HomeScreen"); // Navigate to HomeScreen
            setIsPressed("apple"); // Mark Apple button as pressed
          }}
        >
          <Text
            style={[
              styles.buttonText,
              { color: isPressed === "apple" ? Colors.PRIMARY : Colors.WHITE },
            ]}
          >
            Login with Apple
          </Text>
        </TouchableOpacity>

        {/* Google Login Button */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                isPressed === "google" ? Colors.WHITE : Colors.PRIMARY,
              borderWidth: 2,
              borderColor: Colors.PRIMARY,
            },
          ]}
          onPress={() => {
            navigation.navigate("HomeScreen"); // Navigate to HomeScreen
            setIsPressed("google"); // Mark Google button as pressed
          }}
        >
          <Text
            style={[
              styles.buttonText,
              { color: isPressed === "google" ? Colors.PRIMARY : Colors.WHITE },
            ]}
          >
            Login with Google
          </Text>
        </TouchableOpacity>
      </Animated.View>
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
    padding: 15,
    borderRadius: 99,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "Outfit-Bold",
    fontSize: 16,
  },
});
