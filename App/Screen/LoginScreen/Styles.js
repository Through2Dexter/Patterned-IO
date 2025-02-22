import { StyleSheet } from "react-native";
import Colors from "../../Utils/Colors"; //

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fedbd0",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 50,
  },
  logoImage: {
    width: 350,
    height: 250,
    resizeMode: "contain",
  },
  heading: {
    fontSize: 25,
    fontFamily: "Outfit-Bold",
    textAlign: "center",
    marginTop: 20,
    color: Colors.PRIMARY,
  },
  button: {
    padding: 15,
    borderRadius: 99,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "Outfit-Bold",
    fontSize: 16,
  },
});

export default styles;
