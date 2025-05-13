// BookingScreen.jsx (Client Action)
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  DatePickerIOS,
  Platform,
} from "react-native";

const BookingScreen = ({ route, navigation }) => {
  const { providerId } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleBooking = () => {
    // Add logic to process booking
    alert("Booking Confirmed!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Book a Service</Text>

      {/* Example of selecting date */}
      {Platform.OS === "ios" ? (
        <DatePickerIOS date={selectedDate} onDateChange={setSelectedDate} />
      ) : (
        <TextInput
          style={styles.dateInput}
          placeholder="Select Date"
          value={selectedDate.toString()}
        />
      )}

      <Text style={styles.subHeading}>Select a Service</Text>
      {/* Add list of services */}
      <TouchableOpacity style={styles.serviceButton}>
        <Text style={styles.serviceText}>Haircut - $20</Text>
      </TouchableOpacity>

      <Text style={styles.subHeading}>Enter YourDetails</Text>
      <TextInput style={styles.input} placeholder="Your Name" />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
        <Text style={styles.bookButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  dateInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    paddingLeft: 10,
  },
  serviceButton: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginTop: 10,
  },
  serviceText: {
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    paddingLeft: 10,
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

export default BookingScreen;
