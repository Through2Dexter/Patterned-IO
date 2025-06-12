import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { supabase } from "../../../Assets/supabase.js";
import Colors from "../../Utils/Colors";

const ProviderDetailsScreen = ({ route, navigation }) => {
  const { userId } = route.params; // Get the userId passed from the previous screen

  const [businessName, setBusinessName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");

  const validatePostcode = (code) => {
    const ukPostcodeRegex = /^([A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i;
    return ukPostcodeRegex.test(code.trim());
  };

  const handleSubmit = async () => {
    if (!businessName || !streetAddress || !postcode || !city) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (!validatePostcode(postcode)) {
      Alert.alert("Invalid Postcode", "Please enter a valid UK postcode.");
      return;
    }

    const fullAddress = `${streetAddress}, ${city}, ${postcode}`;

    try {
      // 🗺️ Call OpenCage API to verify address and get coordinates
      const apiKey = "7345d2b92d8d4b8c8a91985adb73202f"; // Replace this with your actual API key
      const encodedAddress = encodeURIComponent(fullAddress);
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${apiKey}`
      );
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        Alert.alert("Invalid Address", "We couldn’t verify this address.");
        return;
      }

      const { lat, lng } = data.results[0].geometry;

      // 📦 Update Supabase
      const { error } = await supabase
        .from("service_providers")
        .update({
          business_name: businessName,
          address: fullAddress,
          lat: lat,
          lon: lng,
        })
        .eq("user_id", userId);

      if (error) {
        Alert.alert("Update Error", error.message);
        return;
      }

      Alert.alert("Success", "Business details saved!");

      // Navigate to the ProvidersServiceSelection screen and pass the userId
      navigation.navigate("ProvidersServiceSelection", { userId: userId });
    } catch (e) {
      console.error(e);
      Alert.alert("Unexpected error occurred.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Almost There...</Text>

      {/* Business Name with a sleek design */}
      <View style={styles.businessNameContainer}>
        <TextInput
          style={styles.businessNameInput}
          placeholder="Business Name"
          value={businessName}
          onChangeText={setBusinessName}
          placeholderTextColor="rgba(0, 0, 0, 0.5)" // Darker placeholder with less opacity
          selectionColor={Colors.PRIMARY} // Color of the cursor
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="House Number & Street Name"
        value={streetAddress}
        onChangeText={setStreetAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Postcode"
        value={postcode}
        onChangeText={setPostcode}
        autoCapitalize="characters"
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default ProviderDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fedbd0",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "Outfit-Bold",
    color: Colors.PRIMARY,
    marginBottom: 30,
    textAlign: "center",
  },
  businessNameContainer: {
    width: "100%",
    marginBottom: 30,
    padding: 10,
  },
  businessNameInput: {
    fontSize: 40, // Large text for business name
    fontFamily: "Outfit-Bold", // Bold font style
    color: Colors.PRIMARY, // Primary color for the text
    textAlign: "center", // Centered text
    borderBottomWidth: 2, // Adding a line below the text for the "cursor" effect
    borderBottomColor: Colors.PRIMARY, // Primary color for the underline
    padding: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff9f7",
    padding: 15,
    borderRadius: 25,
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    marginBottom: 15,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 99,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    fontFamily: "Outfit-Bold",
    fontSize: 16,
    color: "#fff",
  },
});
