import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Image,
  Animated,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Picker } from "@react-native-picker/picker";
import Colors from "../../Utils/Colors";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font"; // Importing expo-font

const HomeScreen = () => {
  const [selectedService, setSelectedService] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [mapType, setMapType] = useState("standard"); // Default map type is standard
  const [loading, setLoading] = useState(true); // Loading state for map

  // Animated values for the menu container animation
  const menuAnim = {
    translateY: useState(new Animated.Value(-300))[0], // Start off-screen (top)
    opacity: useState(new Animated.Value(0))[0], // Start with no opacity
  };

  // Animated values for the service modal animation
  const modalAnim = {
    translateY: useState(new Animated.Value(-300))[0], // Start off-screen (top)
    opacity: useState(new Animated.Value(0))[0], // Start with no opacity
  };

  // Animated value for the logo pulsating effect
  const logoAnim = useState(new Animated.Value(1))[0]; // For pulsating effect

  // Load the custom font
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Outfit-Regular": require("../../../Assets/fonts/Outfit-Regular.ttf"), // Path to your font
      });
      setFontLoaded(true); // Set font loaded state to true
    };

    loadFonts();
  }, []);

  const serviceProviders = [
    {
      id: 1,
      name: "Hair Stylist 1",
      lat: 51.5074,
      lon: -0.1278,
      service: "hair",
    },
    { id: 2, name: "Barber 1", lat: 51.5075, lon: -0.1277, service: "barbers" },
    {
      id: 3,
      name: "Nail Tech 1",
      lat: 51.5073,
      lon: -0.1279,
      service: "nails",
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

  const filteredProviders =
    selectedService === "all"
      ? serviceProviders
      : serviceProviders.filter(
          (provider) => provider.service === selectedService
        );

  // Trigger the animation for the menu when it becomes visible
  useEffect(() => {
    if (isMenuVisible) {
      // Animate menu into view from the top
      Animated.spring(menuAnim.translateY, {
        toValue: 0, // Menu slides down to the user
        friction: 8, // Smooth and soft animation
        tension: 50,
        useNativeDriver: true,
      }).start();

      Animated.timing(menuAnim.opacity, {
        toValue: 1, // Full opacity
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset animation when menu is hidden
      Animated.spring(menuAnim.translateY, {
        toValue: -300, // Hide the menu above the screen
        friction: 1,
        tension: 50,
        useNativeDriver: true,
      }).start();

      Animated.timing(menuAnim.opacity, {
        toValue: 0, // Fade out
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    // Animation for the modal
    if (isModalVisible) {
      Animated.spring(modalAnim.translateY, {
        toValue: 0, // Modal slides down from the top
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }).start();

      Animated.timing(modalAnim.opacity, {
        toValue: 1, // Full opacity
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset modal animation
      Animated.spring(modalAnim.translateY, {
        toValue: -300, // Hide the modal above the screen
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }).start();

      Animated.timing(modalAnim.opacity, {
        toValue: 0, // Fade out
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isMenuVisible, isModalVisible]);

  // Map ready event handler
  const onMapReady = () => {
    setLoading(false); // Map has loaded, hide the loading state
  };

  // Logo pulsating animation
  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.spring(logoAnim, {
            toValue: 1.2,
            friction: 2,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.spring(logoAnim, {
            toValue: 1,
            friction: 2,
            tension: 50,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [loading]);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.overlay}>
          {/* Pulsating Logo */}
          <Animated.Image
            source={require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/logo_.png")} // Add your logo here
            style={[styles.loadingLogo, { transform: [{ scale: logoAnim }] }]}
          />
        </View>
      )}

      <MapView
        style={styles.map}
        mapType={mapType} // Bind mapType to the selected value
        initialRegion={{
          latitude: 51.5074,
          longitude: -0.1278,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onMapReady={onMapReady} // Map ready event handler
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

      {/* Profile Button */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => alert("Open Drawer here!")}
      >
        <Image
          source={require("../../../Assets/Images/profile.jpg")}
          style={styles.profileImage}
        />
      </TouchableOpacity>

      {/* Burger Menu with Border */}
      <TouchableOpacity
        style={styles.burgerMenu}
        activeOpacity={0.9}
        onPress={() => {
          if (isModalVisible) {
            setIsModalVisible(false); // Hide the service picker modal if it's open
          }
          setIsMenuVisible(!isMenuVisible); // Toggle the burger menu
        }}
      >
        <Ionicons name="menu" size={30} color={Colors.PINK} />
      </TouchableOpacity>

      {/* Service Filter Button */}
      {!isMenuVisible && (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.filterText}>
            {selectedService === ""
              ? "Pick a service"
              : selectedService === "all"
              ? "All Services"
              : selectedService.charAt(0).toUpperCase() +
                selectedService.slice(1)}
          </Text>
        </TouchableOpacity>
      )}

      {/* Dark overlay when modal or menu is visible */}
      {(isModalVisible || isMenuVisible) && (
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Service Selection Modal */}
      {isModalVisible && (
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: modalAnim.translateY }],
              opacity: modalAnim.opacity,
            },
          ]}
        >
          <Text style={styles.modalTitle}>Pick a service</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedService}
              onValueChange={(itemValue) => setSelectedService(itemValue)}
              style={styles.picker}
              mode="dropdown"
            >
              <Picker.Item label="All Services" value="all" />
              {[
                "hair",
                "barbers",
                "nails",
                "lashes",
                "loctitians",
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
        </Animated.View>
      )}

      {/* Menu Overlay */}
      {isMenuVisible && (
        <Animated.View
          style={[
            styles.menuOverlay,
            {
              transform: [{ translateY: menuAnim.translateY }],
              opacity: menuAnim.opacity,
            },
          ]}
        >
          <View style={styles.menuContainer}>
            {["standard", "satellite", "hybrid"].map((view, index) => (
              <TouchableOpacity
                key={view}
                style={[
                  styles.menuItem, // Keep the original class
                  mapType === view && { backgroundColor: Colors.PINK }, // Background color change when selected
                  index === 0 && styles.firstMenuItem, // Apply additional style for the first item
                ]}
                onPress={() => {
                  setMapType(view); // Change the map type
                }}
              >
                <Text
                  style={[
                    styles.menuItemText,
                    mapType === view && { color: "#fff" }, // Text color change when selected
                  ]}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}{" "}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Done Button to Close Menu */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setIsMenuVisible(false)}
            activeOpacity={1} // Prevent opacity change when pressed
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
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
    top: 50,
    left: 20,
    zIndex: 100,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: Colors.PRIMARY,
  },
  burgerMenu: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 3,
    borderColor: Colors.PRIMARY,
    zIndex: 200, // Increased zIndex to ensure it sits on top of the overlay
  },
  filterButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    alignSelf: "center",
    position: "absolute",
    bottom: 40,
    zIndex: 100, // Ensure this button stays above the map
    borderColor: Colors.PINK,
    borderWidth: 2,
  },
  filterText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 50,
  },
  loadingLogo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: "50%", // Adjust this for centering
  },
  modalContainer: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    borderColor: Colors.PRIMARY,
    borderWidth: 3,
    zIndex: 200, // Ensure the modal appears above the map
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.PRIMARY,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    width: "100%",
    height: 150,
  },
  doneButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: -25,
    right: -25,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    zIndex: 200,

    height: 253,
  },
  menuContainer: {
    marginTop: 35,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: "center",
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  firstMenuItem: {
    marginTop: 10,
  },
  loadingLogo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    position: "absolute",
    top: "50%", // Positioning might be off due to percentage-based marginTop
    left: "50%",
    marginTop: -50, // Half of the logo height to center it
    marginLeft: -50, // Half of the logo width to center it
  },
});

export default HomeScreen;
