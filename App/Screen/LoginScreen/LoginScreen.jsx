import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import Colors from "../../Utils/Colors";
import { useFonts } from "expo-font";
import styles from "./Styles";

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
      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      Animated.timing(buttonsOpacity, {
        toValue: 1,
        duration: 500,
        delay: 1200,
        useNativeDriver: true,
      }).start();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
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

      <Text style={styles.heading}>Let's pattern it...</Text>

      <Animated.View style={{ opacity: buttonsOpacity }}>
        {/* Login Button */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                isPressed === "login" ? Colors.WHITE : Colors.PRIMARY,
              borderWidth: 2,
              borderColor: Colors.PRIMARY,
            },
          ]}
          onPress={() => {
            navigation.navigate("AuthFormScreen", { mode: "login" }); // Specify mode for login
            setIsPressed("login");
          }}
        >
          <Text
            style={[
              styles.buttonText,
              { color: isPressed === "login" ? Colors.PRIMARY : Colors.WHITE },
            ]}
          >
            Log in
          </Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                isPressed === "signup" ? Colors.WHITE : Colors.PRIMARY,
              borderWidth: 2,
              borderColor: Colors.PRIMARY,
            },
          ]}
          onPress={() => {
            navigation.navigate("WelcomeScreen"); // 👈 changed from AuthFormScreen to WelcomeScreen
            setIsPressed("signup");
          }}
        >
          <Text
            style={[
              styles.buttonText,
              { color: isPressed === "signup" ? Colors.PRIMARY : Colors.WHITE },
            ]}
          >
            Sign up
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
