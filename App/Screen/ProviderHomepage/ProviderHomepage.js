import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../Utils/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import { supabase } from "/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/supabase.js"; // Adjust the path accordingly

export default function ProviderHomepage() {
  const [providerData, setProviderData] = useState(null); // Set initial state to null
  const [loading, setLoading] = useState(true); // To manage loading state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [editedService, setEditedService] = useState({
    name: "",
    description: "",
    price: "",
  });

  const navigation = useNavigation();

  // Fetch provider data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("providers") // Replace with your table name
          .select("*")
          .single(); // Assuming you want to fetch a single provider's data

        if (error) {
          throw error;
        }

        setProviderData(data); // Set the fetched data into state
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching provider data:", error);
        setLoading(false); // Set loading to false on error as well
      }
    };

    fetchData(); // Call the async function when the component mounts
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Loading state handling
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </SafeAreaView>
    );
  }

  // Check if providerData is null or empty
  if (!providerData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>
          Failed to load provider data. Please try again later.
        </Text>
      </SafeAreaView>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 75) {
      return Colors.GREEN;
    } else if (score >= 50) {
      return Colors.YELLOW;
    } else {
      return Colors.RED;
    }
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setEditedService({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
    });
    setModalVisible(true);
  };

  const handleSaveService = () => {
    const updatedServices = providerData.services.map((service) =>
      service.name === selectedService.name
        ? { ...service, ...editedService }
        : service
    );
    setProviderData({ ...providerData, services: updatedServices });
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollableContent}
          contentContainerStyle={styles.scrollableContentContainer}
        >
          <View style={styles.headerContainer}>
            {/* Render the profile image only if providerData.logo exists */}
            {providerData.logo && (
              <Image
                source={{ uri: providerData.logo }}
                style={styles.profileImage}
              />
            )}
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{providerData.name}</Text>
              <Text style={styles.service}>
                Service: {providerData.service}
              </Text>
              <Text
                style={[
                  styles.score,
                  { color: getScoreColor(providerData.reliabilityScore) },
                ]}
              >
                Reliability Score: {providerData.reliabilityScore}
              </Text>
            </View>
          </View>

          {/* Your existing code for services, gallery, etc. */}
        </ScrollView>
      </View>

      {/* Modal for Editing Service */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Modal content */}
      </Modal>
    </SafeAreaView>
  );
}

// StyleSheet remains the same as in your existing code

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

  errorText: {
    textAlign: "center",
    color: Colors.RED,
    fontSize: 18,
    marginTop: 20,
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
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    justifyContent: "space-between", // Pushes the pen icon to the right
  },

  serviceInfo: {
    flexDirection: "column",
    flex: 1, // Takes up remaining space to push the icon to the right
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

  serviceDescription: {
    fontSize: 14,
    color: Colors.GREY,
    marginTop: 5,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    color: Colors.WHITE,
    fontWeight: "bold",
  },
});
