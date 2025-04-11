import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { supabase } from "/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/supabase.js";
import Colors from "../../Utils/Colors";

const ProvidersServiceSelection = ({ route, navigation }) => {
  const { userId } = route.params; // Get userId passed from ProviderDetailsScreen

  const services = [
    { label: "Hair", value: "Hair" },
    { label: "Barbers", value: "Barbers" },
    { label: "Nails", value: "Nails" },
    { label: "Lashes", value: "Lashes" },
    { label: "Brows", value: "Brows" },
    { label: "Facials", value: "Facials" },
    { label: "Makeup", value: "Makeup" },
    { label: "Dental", value: "Dental" },
    { label: "Hair Removal", value: "Hair Removal" },
  ];

  const [selectedService, setSelectedService] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false); // Control visibility of dropdown menu

  const handleServiceSelection = async () => {
    if (!selectedService) {
      Alert.alert("Error", "Please select a service.");
      return;
    }

    try {
      const { error } = await supabase
        .from("service_providers")
        .update({
          service: selectedService, // Update the service column in your table
        })
        .eq("user_id", userId);

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      Alert.alert("Success", "Service saved!");

      // Navigate to the EmailConfirmationScreen instead of ProviderHomepage
      navigation.navigate("EmailConfirmationScreen", { userId: userId });
    } catch (e) {
      console.error(e);
      Alert.alert("Unexpected error occurred.");
    }
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        setSelectedService(item.value);
        setDropdownVisible(false); // Close dropdown after selecting
      }}
    >
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What do you do?</Text>

      {/* Service Selector with button to open dropdown */}
      <View style={styles.pickerContainer}>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setDropdownVisible(!isDropdownVisible)} // Toggle dropdown visibility
        >
          <Text style={styles.pickerText}>
            {selectedService ? selectedService : "Select a Service"}
          </Text>
        </TouchableOpacity>

        {isDropdownVisible && (
          <View style={styles.dropdown}>
            {/* Using FlatList to display scrollable dropdown items */}
            <FlatList
              data={services}
              renderItem={renderServiceItem}
              keyExtractor={(item) => item.value}
              style={styles.dropdownList}
            />
          </View>
        )}
      </View>

      {/* Continue button */}
      <TouchableOpacity style={styles.button} onPress={handleServiceSelection}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProvidersServiceSelection;

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
  pickerContainer: {
    position: "relative", // Allow absolute positioning of dropdown
    width: 250,
  },
  pickerButton: {
    padding: 15,
    backgroundColor: Colors.PINK,
    borderRadius: 25,
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    alignItems: "center",
  },
  pickerText: {
    fontFamily: "Outfit-Regular",
    fontSize: 16,
    color: Colors.PRIMARY,
    fontFamily: "Outfit-Bold",
  },
  dropdown: {
    position: "absolute",
    top: 55, // Position the dropdown below the picker
    left: 0,
    right: 0,
    backgroundColor: "#fff9f7",
    borderRadius: 2,
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    maxHeight: 200, // Limit dropdown height
    zIndex: 1, // Ensure the dropdown is above other elements
    marginTop: 90,
  },
  dropdownList: {
    maxHeight: 200, // Scrollable dropdown
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.PRIMARY,
    backgroundColor: Colors.PINK,
  },
  dropdownItemText: {
    fontFamily: "Outfit-Regular",
    fontSize: 16,
    color: Colors.PRIMARY,
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
