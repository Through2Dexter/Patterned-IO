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
import { useNavigation } from "@react-navigation/native";

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
  const [selectedServiceProvider, setSelectedServiceProvider] = useState(null);
  const [isProviderModalVisible, setIsProviderModalVisible] = useState(false);
  const navigation = useNavigation();

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
      name: "SallyBraids",
      lat: 51.5074,
      lon: -0.1278,
      service: "hair",
      logo: require("../../../Assets/Images/provider1.jpg"),
      reliabilityScore: 100,
      gallery: [
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/hairstylistprofile1.jpg"),
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/hairstylistprofile2.jpg"),
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/hairstylistprofile3.jpg"),
      ],
      services: [
        {
          name: "Basic Braids",
          price: 30,
          duration: 60,
          note: "Simple braids for your hair, a stylish and quick option.",
        },
        {
          name: "Box Braids",
          price: 50,
          duration: 120,
          note: "Traditional box braids with various color options.",
        },
        {
          name: "Cornrows",
          price: 40,
          duration: 90,
          note: "Tight braids close to the scalp for a clean, neat look.",
        },
        {
          name: "Braid Removal",
          price: 25,
          duration: 45,
          note: "Removal of braids, leaving your hair soft and free of tangles.",
        },
      ],
    },
    {
      id: 2,
      name: "TkTrims",
      lat: 51.5292,
      lon: -0.1181,
      service: "barbers",
      logo: require("../../../Assets/Images/provider2.jpg"),
      reliabilityScore: 90,
      gallery: [
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile1.jpg"),
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile3.jpg"),
      ],
      services: [
        {
          name: "Haircut",
          price: 25,
          duration: 30,
          note: "A classic haircut, styled to your preference.",
        },
        {
          name: "Beard Trim",
          price: 15,
          duration: 20,
          note: "A sharp trim for your beard to keep you looking fresh.",
        },
        {
          name: "Shave",
          price: 20,
          duration: 30,
          note: "A close shave for a clean and smooth finish.",
        },
        {
          name: "Haircut + Beard Trim",
          price: 40,
          duration: 50,
          note: "Get a haircut and beard trim in one appointment for the perfect look.",
        },
      ],
    },
    {
      id: 3,
      name: "NailsByP",
      lat: 51.5055,
      lon: -0.0877,
      service: "nails",
      logo: require("../../../Assets/Images/provider4.jpg"),
      reliabilityScore: 105,
      gallery: [
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
      ],
      services: [
        {
          name: "Basic Manicure",
          price: 20,
          duration: 30,
          note: "A classic manicure with a polish of your choice.",
        },
        {
          name: "Gel Nails",
          price: 40,
          duration: 45,
          note: "Long-lasting gel nails with a variety of colors.",
        },
        {
          name: "Nail Art",
          price: 50,
          duration: 60,
          note: "Intricate nail designs and decorations, tailored to your style.",
        },
        {
          name: "Pedicure",
          price: 35,
          duration: 40,
          note: "A relaxing pedicure with a soak, scrub, and polish.",
        },
      ],
    },
    {
      id: 4,
      name: "BrowBoss",
      lat: 51.5111,
      lon: -0.142,
      service: "brows",
      logo: require("../../../Assets/Images/provider5.jpg"),
      reliabilityScore: 110,
      gallery: [
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
      ],
      services: [
        {
          name: "Eyebrow Shaping",
          price: 15,
          duration: 20,
          note: "Shaping your eyebrows to complement your facial features.",
        },
        {
          name: "Eyebrow Tinting",
          price: 20,
          duration: 30,
          note: "Tinting your eyebrows to match your hair color.",
        },
        {
          name: "Eyebrow Threading",
          price: 25,
          duration: 30,
          note: "Precise threading for clean and defined eyebrows.",
        },
        {
          name: "Brow and Lash Combo",
          price: 35,
          duration: 40,
          note: "Combination of eyebrow shaping and lash tinting.",
        },
      ],
    },
    {
      id: 5,
      name: "GentleGlow",
      lat: 51.5033,
      lon: -0.1195,
      service: "facials",
      logo: require("../../../Assets/Images/provider7.jpg"),
      reliabilityScore: 120,
      gallery: [
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
      ],
      services: [
        {
          name: "Classic Facial",
          price: 60,
          duration: 60,
          note: "A deep cleansing facial to remove impurities and rejuvenate your skin.",
        },
        {
          name: "Anti-Aging Facial",
          price: 80,
          duration: 75,
          note: "A facial designed to reduce the appearance of wrinkles and fine lines.",
        },
        {
          name: "Hydrating Facial",
          price: 70,
          duration: 60,
          note: "A hydrating facial to restore moisture and radiance to your skin.",
        },
        {
          name: "Acne Facial",
          price: 75,
          duration: 75,
          note: "A facial targeted at treating acne and blemishes.",
        },
      ],
    },
    {
      id: 6,
      name: "DonebyDona",
      lat: 51.5134,
      lon: -0.1269,
      service: "makeup",
      logo: require("../../../Assets/Images/provider6.jpg"),
      reliabilityScore: 95,
      gallery: [
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
      ],
      services: [
        {
          name: "Full Face Makeup",
          price: 100,
          duration: 90,
          note: "Complete makeup application for any occasion.",
        },
        {
          name: "Bridal Makeup",
          price: 150,
          duration: 120,
          note: "Special makeup for brides on their wedding day.",
        },
        {
          name: "Airbrush Makeup",
          price: 120,
          duration: 90,
          note: "Flawless makeup application using airbrush technology.",
        },
        {
          name: "Makeup Consultation",
          price: 50,
          duration: 30,
          note: "Consultation to choose the best makeup look for your skin tone.",
        },
      ],
    },
    {
      id: 7,
      name: "GiddyGrills",
      lat: 51.4995,
      lon: -0.13,
      service: "dental",
      logo: require("../../../Assets/Images/provider8.jpg"),
      reliabilityScore: 70,
      gallery: [
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
      ],
      services: [
        {
          name: "Teeth Cleaning",
          price: 50,
          duration: 45,
          note: "Thorough cleaning to remove plaque and tartar buildup.",
        },
        {
          name: "Teeth Whitening",
          price: 100,
          duration: 60,
          note: "A professional teeth whitening treatment for a brighter smile.",
        },
        {
          name: "Dental Checkup",
          price: 30,
          duration: 30,
          note: "Routine dental checkup to ensure overall dental health.",
        },
        {
          name: "Fillings",
          price: 80,
          duration: 60,
          note: "Filling cavities to restore the functionality of your teeth.",
        },
      ],
    },
    {
      id: 8,
      name: "LashClub",
      lat: 51.4995,
      lon: -0.132,
      service: "lashes",
      logo: require("../../../Assets/Images/provider9.jpg"),
      reliabilityScore: 85,
      gallery: [
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
        require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/Images/barbersprofile2.jpg"),
      ],
      services: [
        {
          name: "Lash Extensions",
          price: 120,
          duration: 90,
          note: "Beautiful lash extensions applied for a fuller look.",
        },
        {
          name: "Lash Lift",
          price: 70,
          duration: 60,
          note: "A lash lift to give your lashes a natural curl.",
        },
        {
          name: "Lash Tinting",
          price: 40,
          duration: 30,
          note: "Tinting your lashes for a darker, more defined look.",
        },
        {
          name: "Removal of Lash Extensions",
          price: 50,
          duration: 30,
          note: "Removal of lash extensions without damaging natural lashes.",
        },
      ],
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
  const getScoreStyle = (score) => {
    if (score >= 75) {
      return { color: "green" }; // High reliability
    } else if (score >= 50) {
      return { color: "#f7ad23" }; // Medium reliability
    } else {
      return { color: "red" }; // Low reliability
    }
  };

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
            onPress={() => {
              setSelectedServiceProvider(provider); // Set the selected provider
              setIsProviderModalVisible(true); // Show the modal for the selected provider
            }}
          >
            <View style={styles.markerContainer}>
              <Image source={provider.logo} style={styles.markerImage} />
            </View>
          </Marker>
        ))}
      </MapView>

      {isProviderModalVisible && selectedServiceProvider && (
        <Modal
          animationType="none" // Remove the swipe-up animation from the modal itself
          transparent={true}
          visible={isProviderModalVisible}
          onRequestClose={() => setIsProviderModalVisible(false)}
        >
          {/* The overlay behind the modal */}
          <TouchableWithoutFeedback
            onPress={() => setIsProviderModalVisible(false)}
          >
            <View style={styles.providerOverlay} />
          </TouchableWithoutFeedback>

          {/* Updated Modal Container */}
          <View style={styles.providerModalContainer}>
            <Text style={styles.providerModalTitle}>
              {selectedServiceProvider.name}
            </Text>
            <Image
              source={selectedServiceProvider.logo}
              style={styles.providerModalImage}
            />
            <Text style={styles.providerModalText}>
              Service: {selectedServiceProvider.service}
            </Text>

            {/* Reliability Score Section */}
            <View style={styles.reliabilityContainer}>
              <Text style={styles.reliabilityScoreLabel}>
                Reliability Score:
              </Text>
              <Text
                style={[
                  styles.reliabilityScoreValue,
                  getScoreStyle(selectedServiceProvider.reliabilityScore),
                ]}
              >
                {selectedServiceProvider.reliabilityScore}
              </Text>
            </View>
            {/* Touchable Container for "Tap in" Button */}
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <TouchableOpacity
                style={styles.providerCloseButton}
                onPress={() => {
                  setIsProviderModalVisible(false);
                  navigation.navigate("ProviderProfile", {
                    provider: selectedServiceProvider,
                  });
                }}
              >
                <Text style={styles.providerCloseButtonText}>Tap in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

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
                "brows",
                "facials",
                "makeup",
                "dental",
                "hair removal",
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
