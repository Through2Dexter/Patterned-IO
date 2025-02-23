import { StyleSheet } from "react-native";
import Colors from "../../Utils/Colors"; // Import your color constants

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dim background
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  logo: {
    width: 100,
    height: 100,
    opacity: 0.9,
  },

  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  profileButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 100,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: Colors.PRIMARY,
  },
  burgerMenu: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 3,
    borderColor: Colors.PRIMARY,
    zIndex: 200, // Increased zIndex to ensure it sits on top of the overlay
  },
  filterButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    alignSelf: "center",
    position: "absolute",
    bottom: 40,
    zIndex: 100, // Ensure this button stays above the map
    borderColor: Colors.PINK,
    borderWidth: 2,
  },
  filterText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 50,
  },

  modalContainer: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    borderColor: Colors.PRIMARY,
    borderWidth: 3,
    zIndex: 200, // Ensure the modal appears above the map
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.PRIMARY,
  },
  pickerContainer: {
    marginBottom: 20,
    marginTop: -20,
  },
  picker: {
    width: "100%",
    height: 190,
  },
  doneButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: -25,
    right: -25,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    zIndex: 200,

    height: 250,
  },
  menuContainer: {
    marginTop: 35,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: "center",
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.PRIMARY,
  },
  firstMenuItem: {
    marginTop: 10,
  },
});

export default styles;
