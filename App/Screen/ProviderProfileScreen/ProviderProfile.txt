import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { supabase } from "/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/supabase.js"; // Adjust the path accordingly
import Colors from "../../Utils/Colors";

export default function ProviderHomepage() {
  const [providerData, setProviderData] = useState({
    business_name: "",
    service: "",
    full_name: "",
    email: "",
    phone_number: "",
    dob: "",
    address: "",
    bio: "",
    about_us: "",
    logo: "",
    profile_picture: "",
    certificates: [],
    gallery: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // New error state to track errors

  // Fetch provider data from Supabase (business_name, service only)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading

        // Query for specific fields from the 'service_providers' table
        const { data, error } = await supabase
          .from("service_providers")
          .select("business_name, service")
          .single(); // Use .single() to fetch one record

        if (error) {
          // Check for any error
          setError(`Error fetching data: ${error.message}`); // Update error state
          console.error("Error fetching provider data:", error.message);
          setLoading(false);
          return;
        }

        if (!data) {
          // Handle case where no data is returned
          setError("No data found for the provider.");
          console.error("No data found for the provider.");
          setLoading(false);
          return;
        }

        // Set the provider data if successful
        setProviderData((prevData) => ({
          ...prevData,
          business_name: data.business_name,
          service: data.service,
        }));

        setLoading(false); // Done loading
      } catch (error) {
        // Catch any unexpected errors
        setError(`Unexpected error: ${error.message}`);
        console.error("Unexpected error:", error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (field, value) => {
    setProviderData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Save updated provider data
  const handleSave = async () => {
    try {
      const { data, error } = await supabase.from("service_providers").upsert([
        {
          id: providerData.id, // Make sure the ID exists and is correct
          ...providerData,
        },
      ]);

      if (error) {
        setError(`Error updating provider data: ${error.message}`);
        console.error("Error updating provider data:", error.message);
        return;
      }

      console.log("Provider data updated successfully:", data);
    } catch (error) {
      setError(`Error saving provider data: ${error.message}`);
      console.error("Error saving provider data:", error.message);
    }
  };

  // Loading state handling
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </SafeAreaView>
    );
  }

  // Display error message if there is an error
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollableContent}>
        <View style={styles.container}>
          {/* Display business name and service */}
          <Text style={styles.label}>Business Name:</Text>
          <TextInput
            style={styles.input}
            value={providerData.business_name}
            onChangeText={(text) => handleChange("business_name", text)}
            placeholder="Enter business name"
          />

          <Text style={styles.label}>Service:</Text>
          <TextInput
            style={styles.input}
            value={providerData.service}
            onChangeText={(text) => handleChange("service", text)}
            placeholder="Enter service"
          />

          {/* Editable fields for missing data */}
          <Text style={styles.label}>Full Name:</Text>
          <TextInput
            style={styles.input}
            value={providerData.full_name}
            onChangeText={(text) => handleChange("full_name", text)}
            placeholder="Enter full name"
          />

          <Text style={styles.label}>Phone Number:</Text>
          <TextInput
            style={styles.input}
            value={providerData.phone_number}
            onChangeText={(text) => handleChange("phone_number", text)}
            placeholder="Enter phone number"
          />

          <Text style={styles.label}>Date of Birth:</Text>
          <TextInput
            style={styles.input}
            value={providerData.dob}
            onChangeText={(text) => handleChange("dob", text)}
            placeholder="Enter date of birth"
          />

          <Text style={styles.label}>Address:</Text>
          <TextInput
            style={styles.input}
            value={providerData.address}
            onChangeText={(text) => handleChange("address", text)}
            placeholder="Enter address"
          />

          <Text style={styles.label}>Bio:</Text>
          <TextInput
            style={styles.input}
            value={providerData.bio}
            onChangeText={(text) => handleChange("bio", text)}
            placeholder="Enter bio"
          />

          <Text style={styles.label}>About Us:</Text>
          <TextInput
            style={styles.input}
            value={providerData.about_us}
            onChangeText={(text) => handleChange("about_us", text)}
            placeholder="Enter about us"
          />

          <Text style={styles.label}>Logo URL:</Text>
          <TextInput
            style={styles.input}
            value={providerData.logo}
            onChangeText={(text) => handleChange("logo", text)}
            placeholder="Enter logo URL"
          />

          <Text style={styles.label}>Profile Picture URL:</Text>
          <TextInput
            style={styles.input}
            value={providerData.profile_picture}
            onChangeText={(text) => handleChange("profile_picture", text)}
            placeholder="Enter profile picture URL"
          />

          {/* Add a save button */}
          <Button title="Save Changes" onPress={handleSave} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  container: {
    padding: 16,
  },
  scrollableContent: {
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: Colors.GRAY_LIGHT,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorMessage: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
