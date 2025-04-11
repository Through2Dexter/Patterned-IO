import React from "react";
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
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../Utils/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";

const ProviderProfile = ({ route }) => {
  const { provider } = route.params; // Get provider passed from the homepage
  const navigation = useNavigation();

  const imageData = provider.gallery || [];
  const scrollX = new Animated.Value(0);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    scrollX.setValue(contentOffsetX);
  };

  const fadeLeft = scrollX.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const fadeRight = scrollX.interpolate({
    inputRange: [
      0,
      Dimensions.get("window").width - 50,
      Dimensions.get("window").width,
    ],
    outputRange: [0, 1, 0],
    extrapolate: "clamp",
  });

  const getScoreColor = (score) => {
    if (score >= 75) {
      return Colors.GREEN;
    } else if (score >= 50) {
      return Colors.YELLOW;
    } else {
      return Colors.RED;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollableContent}
          contentContainerStyle={styles.scrollableContentContainer}
        >
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: provider.profile_picture }}
              style={styles.profileImage}
            />

            <View style={styles.infoContainer}>
              <Text style={styles.name}>{provider.business_name}</Text>
              <Text style={styles.service}>Service: {provider.service}</Text>
              <Text
                style={[
                  styles.score,
                  { color: getScoreColor(provider.reliabilityScore) },
                ]}
              >
                Reliability Score: {provider.reliabilityScore}
              </Text>
            </View>
          </View>

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
                  "Message",
                  "Reviews",
                  "About",
                ].map((title, index) => (
                  <TouchableOpacity key={index} style={styles.serviceButton}>
                    <Text style={styles.serviceButtonText}>{title}</Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={styles.serviceButton}
                  onPress={() => {
                    const url = `https://www.google.com/maps?q=${provider.latitude},${provider.longitude}`;
                    Linking.openURL(url);
                  }}
                >
                  <Text style={styles.serviceButtonText}>Get Directions</Text>
                </TouchableOpacity>
              </ScrollView>
              <Animated.View
                style={[styles.fadeRight, { opacity: fadeRight }]}
              />
            </View>
          </View>

          <View style={styles.gallerySection}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.galleryContainer}
              showsHorizontalScrollIndicator={false}
            >
              {imageData.map((item, index) => (
                <Image
                  key={index}
                  source={{ uri: item }}
                  style={styles.postImage}
                />
              ))}
            </ScrollView>
          </View>

          {/* Services Section */}
          <View style={styles.servicesListSection}>
            <Text style={styles.sectionTitle}>Services</Text>
            <ScrollView
              contentContainerStyle={styles.servicesListContainer}
              showsVerticalScrollIndicator={false}
            >
              {provider.services &&
                provider.services.map((service, index) => (
                  <View key={index} style={styles.serviceItem}>
                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceName}>{service.name}</Text>
                      <Text style={styles.serviceDetails}>
                        Price: £{service.price} | Duration: {service.duration}{" "}
                        mins
                      </Text>
                      <Text style={styles.serviceNote}>{service.note}</Text>
                    </View>
                    <TouchableOpacity style={styles.checkAvailabilityButton}>
                      <Text style={styles.checkAvailabilityText}>
                        Check Availability
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>

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
const imageSize = windowWidth / 3 - 10;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.PINK,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.PINK,
  },
  scrollableContent: {
    flex: 1,
    marginBottom: 60, // This will leave space for the fixed footer
  },
  scrollableContentContainer: {
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
    borderWidth: 5,
    borderColor: Colors.PRIMARY,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  infoContainer: {
    alignItems: "center", // Center the text horizontally under the profile image
    marginTop: 10, // Space between the image and the text
  },
  name: {
    fontSize: 32,
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
    fontWeight: "bold", // Make the score bold for emphasis
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
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
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
  servicesListSection: {
    marginTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginBottom: 10,
    marginTop: -30,
    textAlign: "center",
    justifyContent: "center",
  },
  servicesListContainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    marginBottom: 15,
    marginTop: 6,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.PRIMARY,
  },
  serviceDetails: {
    fontSize: 14,
    color: Colors.GRAY,
    marginTop: 5,
  },
  serviceNote: {
    fontSize: 12,
    color: Colors.GRAY,
    marginTop: 5,
  },
  checkAvailabilityButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  checkAvailabilityText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  manageSection: {
    marginTop: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  manageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginBottom: 15,
  },
  manageButtonsContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  manageButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 7,
    marginBottom: 15,
  },
  manageButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProviderProfile;
