import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Image,
  Easing,
  Animated,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Picker } from "@react-native-picker/picker";
import Colors from "../../Utils/Colors";
import styles from "./Styles";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font"; // Importing expo-font
import * as Location from "expo-location"; // Import Expo Location;

const HomeScreen = () => {
  const [selectedService, setSelectedService] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [mapType, setMapType] = useState("standard"); // Default map type is standard
  const [loading, setLoading] = useState(true); // Loading state for map
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Animated values for the menu container animation
  const menuAnim = {
    translateY: useState(new Animated.Value(-300))[0], // Start off-screen (top)
    opacity: useState(new Animated.Value(0))[0], // Start with no opacity
  };

  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Function to loop animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        setLoadingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setLoadingLocation(false);
    })();
  }, []);

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

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType={mapType}
        region={
          userLocation || {
            latitude: 51.5074, // Default to London if location is not available
            longitude: -0.1278,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }
        }
        onMapReady={onMapReady}
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
          activeOpacity={0.9} // Darkens the button slightly on press
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
                disabled={mapType === view} // Disable button if it's already selected
              >
                <Text
                  style={[
                    styles.menuItemText,
                    mapType === view && { color: "#fff" }, // Text color change when selected
                    { opacity: mapType === view ? 0.5 : 1 }, // Reduce opacity for selected items
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

export default HomeScreen;
