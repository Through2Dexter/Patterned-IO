// ProviderProfileScreen.jsx (Client View)
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

const ProviderProfileScreen = ({ route, navigation }) => {
  const { providerId } = route.params;

  // Example provider data (Replace with dynamic data)
  const provider = {
    id: providerId,
    name: "John's Barbershop",
    rating: 4.5,
    services: [
      { name: "Haircut", price: "$20" },
      { name: "Shave", price: "$15" },
    ],
    bio: "We offer the best haircuts in town with a friendly environment.",
    image: require("../../../Assets/Images/provider1.jpg"),
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={provider.image} style={styles.providerImage} />
      <Text style={styles.providerName}>{provider.name}</Text>
      <Text style={styles.providerBio}>{provider.bio}</Text>
      <Text style={styles.providerRating}>Rating: {provider.rating}</Text>

      <Text style={styles.serviceHeading}>Services Offered:</Text>
      {provider.services.map((service, index) => (
        <View key={index} style={styles.serviceItem}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.servicePrice}>{service.price}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() =>
          navigation.navigate("BookingScreen", { providerId: provider.id })
        }
      >
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  providerImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  providerName: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  providerBio: {
    fontSize: 16,
    color: "#555",
  },
  providerRating: {
    fontSize: 16,
    marginVertical: 5,
  },
  serviceHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  serviceName: {
    fontSize: 16,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookButton: {
    backgroundColor: "#FF5733",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default ProviderProfileScreen;
