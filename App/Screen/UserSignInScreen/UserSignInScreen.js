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
  Vibration,
} from "react-native";
import { supabase } from "../../../Assets/supabase.js";
import Colors from "../../Utils/Colors";
import Icon from "react-native-vector-icons/FontAwesome";
import { Audio } from "expo-av";

const UserSignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);

  // Function to play a success sound on successful login
  const playSuccessSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/Assets/sounds/bing.mp3")
    );
    await sound.playAsync();
  };

  // Function to handle the back button press
  const handleBack = () => {
    navigation.goBack();
  };

  // Function to handle user login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert("Login Error", error.message);
        return;
      }

      if (data?.user) {
        Vibration.vibrate(500); // Vibrate for feedback
        await playSuccessSound(); // Play success sound
        setIsLoginSuccessful(true);

        const { user } = data;
        const { id: userId } = user;

        console.log("User ID: ", userId);
        console.log("Email: ", email);

        setTimeout(async () => {
          console.log("Searching for service provider...");

          // Check if the user is a service provider
          const { data: providerData, error: providerError } = await supabase
            .from("service_providers")
            .select("*")
            .eq("email", email.trim().toLowerCase()) // Normalize email case
            .eq("user_id", userId); // Match using user_id

          if (providerError) {
            console.error("Error fetching provider data:", providerError);
            Alert.alert("Error", "There was an error fetching provider data.");
            return;
          }

          if (providerData && providerData.length > 0) {
            console.log("Service provider found:", providerData);
            Alert.alert("Success", "Logged in successfully as Provider!");
            navigation.navigate("ProviderHomepage"); // Navigate to the provider homepage
          } else {
            console.log("No service provider found, checking clients...");

            // If no service provider found, now check clients table
            const { data: clientData, error: clientError } = await supabase
              .from("clients")
              .select("*")
              .eq("email", email.trim().toLowerCase()) // Normalize email case
              .eq("user_id", userId); // Match using user_id

            if (clientError) {
              console.error("Error fetching client data:", clientError);
              Alert.alert("Error", "There was an error fetching client data.");
              return;
            }

            if (clientData && clientData.length > 0) {
              console.log("Client found:", clientData);
              Alert.alert("Success", "Logged in successfully as Client!");
              navigation.navigate("HomeScreen"); // Navigate to the client homepage
            } else {
              // Handle the case where no provider and no client data is found
              console.log("No client found.");
              Alert.alert("Error", "User not found in any role.");
            }
          }
        }, 1000); // Delay for smooth transition
      }
    } catch (e) {
      console.error("Unexpected error:", e);
      Alert.alert("Unexpected error occurred.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="chevron-left" size={35} color={Colors.PRIMARY} />
        </TouchableOpacity>

        <Text style={styles.title}>Welcome Back! 👋</Text>

        {/* Email Input */}
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

        {/* Password Input */}
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
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          style={[
            styles.button,
            {
              backgroundColor: isLoginSuccessful ? "green" : Colors.PRIMARY,
            },
          ]}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        {/* Forgot Password Link */}
        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => navigation.navigate("PasswordRecoveryScreen")}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.navigate("SignupScreen")}
        >
          <Text style={styles.createAccountText}>
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default UserSignInScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fedbd0",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
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
    textAlign: "left",
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
  forgotPasswordButton: {
    marginTop: 15,
  },
  forgotPasswordText: {
    color: Colors.PRIMARY,
    fontSize: 16,
  },
  createAccountButton: {
    marginTop: 15,
  },
  createAccountText: {
    color: Colors.PRIMARY,
    fontSize: 16,
  },
});
