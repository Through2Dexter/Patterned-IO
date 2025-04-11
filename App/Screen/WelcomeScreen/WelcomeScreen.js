import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../../Utils/Colors";
import Icon from "react-native-vector-icons/FontAwesome";

export default function WelcomeScreen({ navigation }) {
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Icon name="chevron-left" size={35} color={Colors.PRIMARY} />
      </TouchableOpacity>

      <Text style={styles.heading}>Please Select Your Role</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ClientSignupScreen")}
      >
        <Text style={styles.buttonText}>I am seeking a service</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ProviderSignupScreen")}
      >
        <Text style={styles.buttonText}>I am a service provider</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.PINK,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },
});
