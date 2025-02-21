import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../Utils/Colors"; // Ensure this file exists!

export default function LoginScreen({ navigation }) {
  const handleLogin = () => {
    navigation.navigate("HomeScreen"); // Navigate to HomeScreen
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../Assets/Images/logo_.png")} // ✅ Updated to "Assets"
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
    width: 250,
    height: 150,
    resizeMode: "contain",
  },
  heading: {
    fontSize: 25,
    fontFamily: "outfit-bold",
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
    fontFamily: "outfit",
    fontSize: 14,
  },
});
