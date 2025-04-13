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
import { supabase } from "/Users/drigyy/Desktop/Software Deveopment/BlueScope Technologies Incorperated/Patterned-IO/supabase.js";
import zxcvbn from "zxcvbn";
import Colors from "../../Utils/Colors";
import Icon from "react-native-vector-icons/FontAwesome";

const ClientSignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
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

      const { error: insertError } = await supabase.from("clients").insert([
        {
          id: data.user.id, // optional if you have it as PK
          user_id: data.user.id, // 🔑 THIS is the fix!
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

      // 👇 Go to email confirmation screen
      navigation.navigate("EmailConfirmationScreen", {
        userId: data.user.id,
        email,
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
    let formattedInput = input.replace(/[^0-9]/g, "");
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                  width: `${Math.max(Math.min(password.length * 5, 100), 20)}%`,
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

export default ClientSignupScreen;

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
  passwordStrengthContainer: {
    marginTop: 10,
    marginBottom: 15,
    alignItems: "center",
    position: "absolute",
    bottom: 100,
    width: "80%",
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
