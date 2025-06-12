import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { supabase } from "../../../Assets/supabase.js";
import zxcvbn from "zxcvbn";
import Colors from "../../Utils/Colors";
import Icon from "react-native-vector-icons/FontAwesome";

const ProviderSignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState(""); // Manual input for DOB
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAuth = async () => {
    if (!email || !password || !fullName || !phoneNumber || !dob) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      // Step 1: Sign up the provider with email and password via Supabase Auth
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        Alert.alert("Auth Error", error.message);
        return;
      }

      if (!data?.user) {
        Alert.alert(
          "Almost there!",
          "Please check your email and confirm your address to complete signup."
        );
        return;
      }

      // Step 2: Insert provider details into the 'service_providers' table, including email
      const { error: insertError } = await supabase
        .from("service_providers")
        .insert([
          {
            user_id: data.user.id, // ✅ Store UUID in the correct column
            full_name: fullName,
            phone_number: phoneNumber,
            dob: dob,
            email: email,
          },
        ]);

      if (insertError) {
        Alert.alert("Insert Error", insertError.message);
        return;
      }

      Alert.alert(
        "Success",
        "Signed up successfully! Please check your email to confirm your registration."
      );
      navigation.navigate("ProviderDetailsScreen", {
        userId: data.user.id,
      });
    } catch (e) {
      console.error(e);
      Alert.alert("Unexpected error occurred.");
    }
  };

  const handlePasswordChange = (password) => {
    setPassword(password);
    const result = zxcvbn(password);

    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length > 6 && hasSpecialCharacter) {
      setPasswordStrength(3);
    } else {
      setPasswordStrength(result.score);
    }
  };

  const handleDobChange = (input) => {
    // Allow only numeric characters
    let formattedInput = input.replace(/[^0-9]/g, "");

    // Format as MM/DD/YYYY
    if (formattedInput.length >= 3) {
      formattedInput = `${formattedInput.slice(0, 2)}/${formattedInput.slice(
        2
      )}`;
    }
    if (formattedInput.length >= 6) {
      formattedInput = `${formattedInput.slice(0, 5)}/${formattedInput.slice(
        5
      )}`;
    }

    setDob(formattedInput);
  };

  const passwordStrengthLabel = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["#ff4d4d", "#ffcc00", "#ffcc00", "#4caf50"];

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer} // Ensure ScrollView covers the entire screen
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="chevron-left" size={35} color={Colors.PRIMARY} />
        </TouchableOpacity>

        <Text style={styles.title}>Let's get started 🙌</Text>

        <View style={styles.inputContainer}>
          <Icon
            name="user"
            size={20}
            color={Colors.PRIMARY}
            style={styles.icon}
          />
          <TextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon
            name="envelope"
            size={20}
            color={Colors.PRIMARY}
            style={styles.icon}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon
            name="phone"
            size={20}
            color={Colors.PRIMARY}
            style={styles.icon}
          />
          <TextInput
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        {/* Manual DOB Entry with auto format */}
        <View style={styles.inputContainer}>
          <Icon
            name="calendar"
            size={20}
            color={Colors.PRIMARY}
            style={styles.icon}
          />
          <TextInput
            placeholder="Date of Birth (MM/DD/YYYY)"
            value={dob}
            onChangeText={handleDobChange}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon
            name="lock"
            size={20}
            color={Colors.PRIMARY}
            style={styles.icon}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {/* Password Strength Indicator */}
        {password.length > 0 && (
          <View style={styles.passwordStrengthContainer}>
            <Text style={styles.passwordStrengthText}>
              Password Strength: {passwordStrengthLabel[passwordStrength]}
            </Text>
            <View
              style={[
                styles.passwordStrengthBar,
                {
                  backgroundColor: strengthColors[passwordStrength],
                  width: `${Math.max(Math.min(password.length * 5, 100), 20)}%`, // Ensure the width is at least 20%
                },
              ]}
            />
          </View>
        )}

        <TouchableOpacity onPress={handleAuth} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default ProviderSignupScreen;

// Updated Styles

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures ScrollView takes up all available space
    backgroundColor: "#fedbd0", // Pink background color
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fedbd0", // Ensure the full screen background is pink
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 35,
    fontFamily: "Outfit-Bold",
    textAlign: "center",
    marginBottom: 30,
    color: Colors.PRIMARY,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    marginBottom: 15,
    width: "80%",
    backgroundColor: "#fff9f7",
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  icon: {
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    padding: 10,
    height: 50,
    color: "black",
    borderRadius: 25,
    textAlign: "left", // Align text to the left inside the input
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 99,
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: 60,
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "Outfit-Bold",
    fontSize: 16,
    color: "#fff",
  },
  passwordStrengthContainer: {
    marginTop: 10,
    marginBottom: 15,
    alignItems: "center",
    position: "absolute", // Absolute positioning to avoid shifting layout
    bottom: 100, // Adjust bottom distance as necessary
    width: "80%", // Keep the width consistent with input fields
  },
  passwordStrengthText: {
    textAlign: "center",
    marginBottom: 5,
    color: Colors.PRIMARY,
  },
  passwordStrengthBar: {
    height: 5,
    borderRadius: 3,
    maxWidth: "100%",
    width: "100%",
  },
});
