import React, { useEffect, useState } from "react";
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
import Colors from "../../Utils/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import { supabase } from "../../../Assets/supabase.js";

const ClientMyProfileScreen = ({ route }) => {
  const { user_id } = route.params || {}; // expects user_id to be passed
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [bookings, setBookings] = useState([]); // State to hold bookings
  const navigation = useNavigation();

  const scrollX = new Animated.Value(0);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        let id = user_id;

        // If no user_id is passed, get the current authenticated user
        if (!id) {
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();
          if (error || !user) {
            console.error("No user found.");
            return;
          }
          id = user.id;
        }

        // Fetch client data from the 'clients' table
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .eq("id", id)
          .single(); // Retrieve only one record

        if (error) {
          console.error("Error fetching client data:", error.message);
          return;
        }
        setClientData(data); // Set the fetched client data
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBookings = async () => {
      try {
        let id = user_id;

        // If no user_id is passed, get the authenticated user ID
        if (!id) {
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();
          if (error || !user) {
            console.error("No authenticated user found.");
            return;
          }
          id = user.id;
        }

        // Query for bookings based on client_id
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("client_id", id);

        if (error) {
          console.error("Error fetching bookings:", error.message);
          return;
        }

        setBookings(data); // Set the fetched bookings
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchClientData();
    fetchBookings();
  }, [user_id]);

  const handleScroll = (event) => {
    scrollX.setValue(event.nativeEvent.contentOffset.x);
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
    if (score >= 75) return Colors.GREEN;
    if (score >= 50) return Colors.YELLOW;
    return Colors.RED;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!clientData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>No client data found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollableContent}
          contentContainerStyle={styles.scrollableContentContainer}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: clientData.profile_picture }}
              style={styles.profileImage}
            />
            <View style={styles.infoContainer}>
              {/* Display Full Name */}
              <Text style={styles.name}>{clientData.full_name}</Text>
              {/* Display Reliability Score */}
              <Text
                style={[
                  styles.score,
                  { color: getScoreColor(clientData.reliability_score) },
                ]}
              >
                Reliability Score: {clientData.reliability_score}
              </Text>
            </View>
          </View>

          {/* Buttons Section */}
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
                  onPress={async () => {
                    const { error } = await supabase.auth.signOut();
                    if (error) {
                      console.error("Sign out error:", error.message);
                    } else {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "LoginScreen" }], // Adjust to your actual login screen
                      });
                    }
                  }}
                >
                  <Text style={styles.serviceButtonText}>Sign Out</Text>
                </TouchableOpacity>
              </ScrollView>
              <Animated.View
                style={[styles.fadeRight, { opacity: fadeRight }]}
              />
            </View>
          </View>

          {/* Bookings Section */}
          <View style={styles.bookingsSection}>
            <Text style={styles.sectionTitle}>Your Bookings</Text>
            {bookings.length === 0 ? (
              <Text>No bookings found</Text>
            ) : (
              bookings.map((booking, index) => (
                <View key={index} style={styles.bookingContainer}>
                  <Text style={styles.bookingText}>
                    Booking ID: {booking.id}
                  </Text>
                  <Text style={styles.bookingText}>Date: {booking.date}</Text>
                  <Text style={styles.bookingText}>
                    Status: {booking.status}
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>

      {/* Footer */}
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
    marginBottom: 60,
  },
  scrollableContentContainer: {
    padding: 15,
  },
  headerContainer: {
    alignItems: "center",
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
  },
  infoContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.PRIMARY,
  },
  score: {
    fontSize: 16,
    fontWeight: "bold",
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
  },
  serviceButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  bookingsSection: {
    marginTop: 20,
  },
  bookingContainer: {
    backgroundColor: Colors.WHITE,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  bookingText: {
    fontSize: 16,
    color: Colors.PRIMARY,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginBottom: 10,
    marginTop: -30,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 15,
    backgroundColor: Colors.PINK,
    justifyContent: "center",
    alignItems: "center",
  },
  footerButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});

export default ClientMyProfileScreen;
