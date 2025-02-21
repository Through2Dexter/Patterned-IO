import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Picker } from "@react-native-picker/picker";
import Colors from "../../Utils/Colors"; // Import Colors from Utils/Colors.js

const HomeScreen = () => {
  const [selectedService, setSelectedService] = useState("hairstylists");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Service provider data
  const serviceProviders = [
    {
      id: 1,
      name: "Hair Stylist 1",
      lat: 51.5074,
      lon: -0.1278,
      service: "hairstylists",
    },
    { id: 2, name: "Barber 1", lat: 51.5075, lon: -0.1277, service: "barbers" },
    {
      id: 3,
      name: "Nail Tech 1",
      lat: 51.5073,
      lon: -0.1279,
      service: "nailtechs",
    },
    {
      id: 4,
      name: "Loctician 1",
      lat: 51.508,
      lon: -0.128,
      service: "loctitians",
    },
    {
      id: 5,
      name: "Facial Expert 1",
      lat: 51.509,
      lon: -0.129,
      service: "facials",
    },
    {
      id: 6,
      name: "Makeup Artist 1",
      lat: 51.51,
      lon: -0.13,
      service: "makeup",
    },
    {
      id: 7,
      name: "Dental Specialist 1",
      lat: 51.511,
      lon: -0.131,
      service: "dental",
    },
  ];

  const filteredProviders = serviceProviders.filter(
    (provider) => provider.service === selectedService
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 51.5074,
          longitude: -0.1278,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {filteredProviders.map((provider) => (
          <Marker
            key={provider.id}
            coordinate={{ latitude: provider.lat, longitude: provider.lon }}
            title={provider.name}
            description={provider.service}
            pinColor={
              selectedService === provider.service ? Colors.PRIMARY : "#3388FF"
            }
          />
        ))}
      </MapView>

      {/* Profile Button with Image */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => alert("Open Drawer here!")} // Replace with your navigation function
      >
        <Image
          source={require("../../../Assets/Images/profile.jpg")} // Correct relative path
          style={styles.profileImage}
        />
      </TouchableOpacity>

      {/* Button for service filter */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.filterText}>
          {selectedService.charAt(0).toUpperCase() + selectedService.slice(1)}
        </Text>
      </TouchableOpacity>

      {/* Dark overlay and carousel (picker) */}
      {isModalVisible && (
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Modal to show service options */}
      {isModalVisible && (
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Choose a service</Text>

          {/* Carousel-style Picker */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedService}
              onValueChange={(itemValue) => setSelectedService(itemValue)}
              style={styles.picker}
              mode="dropdown"
            >
              {[
                "hairstylists",
                "barbers",
                "loctitians",
                "nailtechs",
                "facials",
                "makeup",
                "dental",
              ].map((service) => (
                <Picker.Item
                  key={service}
                  label={service.charAt(0).toUpperCase() + service.slice(1)}
                  value={service}
                />
              ))}
            </Picker>
          </View>

          {/* Done Button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  profileButton: {
    position: "absolute",
    top: 50, // Adjusted to move it down (previously 20px)
    left: 20,
    zIndex: 100,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circular image
    borderWidth: 3,
    borderColor: Colors.PRIMARY, // Add a border color
  },
  filterButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    alignSelf: "center",
    position: "absolute",
    bottom: 50, // Increased to make it more prominent
    zIndex: 100,
  },
  filterText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark overlay for better contrast
  },
  modalContainer: {
    position: "absolute",
    top: "30%", // Adjusted to center the modal
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff", // White title text
    textAlign: "center",
  },
  pickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%", // Ensure it's centered
    marginBottom: 20,
    overflow: "hidden", // Prevent services from overflowing
    height: 200, // Explicit height for better control of visibility
    backgroundColor: "white",
    borderRadius: 10,
  },
  picker: {
    width: "100%",
    height: 240,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  doneButton: {
    backgroundColor: Colors.SECONDARY,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
    borderRadius: 10,
    alignSelf: "center",
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
