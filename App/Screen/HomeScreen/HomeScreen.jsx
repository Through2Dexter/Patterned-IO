// HomeScreen.js
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
import { useNavigation } from "@react-navigation/native";
import styles from "./Styles";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as Location from "expo-location";
import { supabase } from "/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/supabase.js";

const HomeScreen = () => {
  const [selectedService, setSelectedService] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [mapType, setMapType] = useState("standard");
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [selectedServiceProvider, setSelectedServiceProvider] = useState(null);
  const [isProviderModalVisible, setIsProviderModalVisible] = useState(false);
  const navigation = useNavigation();
  const [serviceProviders, setServiceProviders] = useState([]);

  const menuAnim = {
    translateY: useState(new Animated.Value(-300))[0],
    opacity: useState(new Animated.Value(0))[0],
  };

  const modalAnim = {
    translateY: useState(new Animated.Value(-300))[0],
    opacity: useState(new Animated.Value(0))[0],
  };

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

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Outfit-Regular": require("../../../Assets/fonts/Outfit-Regular.ttf"),
      });
      setFontLoaded(true);
    };
    loadFonts();
  }, []);

  const handleProfilePress = () => {
    navigation.navigate("ClientMyProfileScreen");
  };

  useEffect(() => {
    const getCoordinatesFromAddress = async (address) => {
      try {
        const results = await Location.geocodeAsync(address);
        if (results.length > 0) {
          const { latitude, longitude } = results[0];
          return { lat: latitude, lon: longitude };
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
      return null;
    };

    const fetchProviders = async () => {
      const { data, error } = await supabase
        .from("service_providers")
        .select("*");

      if (error) {
        console.error("Error fetching service providers:", error);
        return;
      }

      const formatted = await Promise.all(
        data.map(async (provider) => {
          let lat = provider.lat;
          let lon = provider.lon;

          if ((!lat || !lon) && provider.address) {
            const coords = await getCoordinatesFromAddress(provider.address);
            if (coords) {
              lat = coords.lat;
              lon = coords.lon;
              await supabase
                .from("service_providers")
                .update({ lat, lon })
                .eq("id", provider.id);
            }
          }

          return {
            ...provider,
            lat,
            lon,
            logo: provider.profile_picture,
            reliabilityScore: provider.reliability_score,
          };
        })
      );

      setServiceProviders(formatted);
    };

    fetchProviders();
  }, []);

  const filteredProviders =
    selectedService === "all"
      ? serviceProviders
      : serviceProviders.filter(
          (provider) => provider.service === selectedService
        );

  useEffect(() => {
    const animate = (visible, anim) => {
      Animated.spring(anim.translateY, {
        toValue: visible ? 0 : -300,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }).start();
      Animated.timing(anim.opacity, {
        toValue: visible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };
    animate(isMenuVisible, menuAnim);
    animate(isModalVisible, modalAnim);
  }, [isMenuVisible, isModalVisible]);

  const onMapReady = () => setLoading(false);

  const getScoreStyle = (score) => {
    if (score >= 75) return { color: "green" };
    if (score >= 50) return { color: "#f7ad23" };
    return { color: "red" };
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType={mapType}
        region={
          userLocation || {
            latitude: 51.5074,
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
            title={provider.business_name}
            description={provider.service}
            pinColor={
              selectedService === provider.service ? Colors.PRIMARY : "#3388FF"
            }
            onPress={() => {
              setSelectedServiceProvider(provider);
              setIsProviderModalVisible(true);
            }}
          >
            <View style={styles.markerContainer}>
              {provider.profile_picture && (
                <Image
                  source={{ uri: provider.profile_picture }}
                  style={styles.markerImage}
                />
              )}
            </View>
          </Marker>
        ))}
      </MapView>

      {isProviderModalVisible && selectedServiceProvider && (
        <Modal
          animationType="none"
          transparent={true}
          visible={isProviderModalVisible}
          onRequestClose={() => setIsProviderModalVisible(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setIsProviderModalVisible(false)}
          >
            <View style={styles.providerOverlay} />
          </TouchableWithoutFeedback>

          <View style={styles.providerModalContainer}>
            <Text style={styles.providerModalTitle}>
              {selectedServiceProvider.name}
            </Text>
            <Image
              source={{ uri: selectedServiceProvider.logo }}
              style={styles.providerModalImage}
            />
            <Text style={styles.providerModalText}>
              Service: {selectedServiceProvider.service}
            </Text>
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

      <TouchableOpacity
        style={styles.profileButton}
        onPress={handleProfilePress}
      >
        <Image
          source={require("../../../Assets/Images/profile.jpg")}
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.burgerMenu}
        activeOpacity={0.9}
        onPress={() => {
          if (isModalVisible) setIsModalVisible(false);
          setIsMenuVisible(!isMenuVisible);
        }}
      >
        <Ionicons name="menu" size={30} color={Colors.PINK} />
      </TouchableOpacity>

      {!isMenuVisible && (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setIsModalVisible(true)}
          activeOpacity={0.9}
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

      {(isModalVisible || isMenuVisible) && (
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
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
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

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
                  styles.menuItem,
                  mapType === view && { backgroundColor: Colors.PINK },
                  index === 0 && styles.firstMenuItem,
                ]}
                onPress={() => setMapType(view)}
                disabled={mapType === view}
              >
                <Text
                  style={[
                    styles.menuItemText,
                    mapType === view && { color: "#fff" },
                    { opacity: mapType === view ? 0.5 : 1 },
                  ]}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setIsMenuVisible(false)}
            activeOpacity={1}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default HomeScreen;
