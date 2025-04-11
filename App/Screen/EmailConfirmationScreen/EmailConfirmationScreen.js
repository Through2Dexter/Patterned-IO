import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // For the mail icon
import Colors from "../../Utils/Colors"; // Assume Colors has your color scheme
import { useNavigation } from "@react-navigation/native"; // For navigation

const EmailConfirmationScreen = () => {
  const navigation = useNavigation();

  const handleLoginRedirect = () => {
    navigation.navigate("LoginScreen"); // Navigate to the login page once they have confirmed their email
  };

  return (
    <View style={styles.container}>
      {/* Mail Icon */}
      <Icon
        name="envelope"
        size={150}
        color={Colors.PRIMARY}
        style={styles.icon}
      />

      <Text style={styles.title}>Almost there!</Text>
      <Text style={styles.subtitle}>
        Please check your inbox and confirm your email address.
      </Text>

      <View style={styles.stepsContainer}>
        <Text style={styles.stepText}>1. Confirm your email</Text>
        <Text style={styles.stepText}>2. Log in</Text>
      </View>

      {/* Button to redirect to the login page */}
      <TouchableOpacity style={styles.button} onPress={handleLoginRedirect}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmailConfirmationScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2", // Light gray background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
    color: "#333", // Darker text for readability
  },
  stepsContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  stepText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#555", // Lighter text for steps
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
