import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../Utils/Colors"; // Ensure this file exports PRIMARY and PINK
import Icon from "react-native-vector-icons/MaterialIcons";

const ProviderProfile = ({ route }) => {
  const { provider } = route.params;
  const navigation = useNavigation();

  const imageData = provider.gallery || []; // Use provider's gallery images
  const scrollX = new Animated.Value(0); // Initialize scrollX as Animated.Value

  // Handle scroll to update scroll position
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    scrollX.setValue(contentOffsetX); // Set the value for scrollX
  };

  // Determine the opacity for the fade effect based on scroll position
  const fadeLeft = scrollX.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0], // Fully visible at start, fade out to the left
    extrapolate: "clamp",
  });

  const fadeRight = scrollX.interpolate({
    inputRange: [
      0,
      Dimensions.get("window").width - 50,
      Dimensions.get("window").width,
    ],
    outputRange: [0, 1, 0], // Fade in as we scroll, and fade out at the end
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Image source={provider.logo} style={styles.profileImage} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{provider.name}</Text>
            <Text style={styles.service}>Service: {provider.service}</Text>
            <Text style={styles.score}>
              Reliability Score: {provider.reliabilityScore}
            </Text>
          </View>
        </View>

        {/* Action Buttons Section */}
        <View style={styles.servicesSection}>
          <View style={styles.servicesContainer}>
            <Animated.View style={[styles.fadeLeft, { opacity: fadeLeft }]} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              contentContainerStyle={styles.servicesButtonsContainer}
            >
              {[
                "Book now",
                "Gallery",
                "Emergency slot",
                "Services",
                "Message us",
                "Reviews",
              ].map((title, index) => (
                <TouchableOpacity key={index} style={styles.serviceButton}>
                  <Text style={styles.serviceButtonText}>{title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Animated.View style={[styles.fadeRight, { opacity: fadeRight }]} />
          </View>
        </View>

        {/* Horizontal Scrollable Image Gallery */}
        <View style={styles.gallerySection}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.galleryContainer}
            showsHorizontalScrollIndicator={false}
          >
            {imageData.map((item, index) => (
              <Image key={index} source={item} style={styles.postImage} />
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Icon name="public" size={40} color={Colors.PINK} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get("window").width;
const imageSize = windowWidth / 3 - 10; // Adjust spacing

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.PINK,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.PINK,
    padding: 15,
  },
  headerContainer: {
    alignItems: "center", // Center content horizontally
    borderBottomWidth: 1,
    borderBottomColor: Colors.PRIMARY,
    paddingBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  infoContainer: {
    alignItems: "center", // Center the text horizontally under the profile image
    marginTop: 10, // Space between the image and the text
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.PRIMARY,
  },
  service: {
    fontSize: 16,
    color: Colors.PRIMARY,
    marginTop: 5,
  },
  score: {
    fontSize: 16,
    color: Colors.PRIMARY,
    marginTop: 5,
  },
  servicesSection: {
    paddingVertical: 15,
  },
  servicesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  servicesButtonsContainer: {
    flexDirection: "row",
  },
  serviceButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  gallerySection: {
    marginBottom: 20, // Space below the gallery
  },
  galleryContainer: {
    paddingLeft: 10,
    paddingBottom: 10,
  },
  postImage: {
    width: imageSize,
    height: imageSize,
    margin: 5,
    borderRadius: 8,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  footer: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: Colors.PINK,
  },
  footerButton: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
});

export default ProviderProfile;
