// Overlay.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { useApi } from "@/components/ApiContext"; // Import useApi to access the context

const { width, height } = Dimensions.get("window");
const BOARD_SIZE = Math.min(width, height);

const Overlay: React.FC = () => {
  const { setIsOn, setLoggedIn } = useApi(); // Access the state setters

  const handleQuit = () => {
    // Set both isOn and loggedIn to false when quitting
    setIsOn(false);
    setLoggedIn(false);
  };

  return (
    <BlurView style={styles.overlay} intensity={80} tint="dark">
      <View style={styles.warningBox}>
        <Text style={styles.title}>Warning</Text>
        <Text style={styles.message}>NFC Tag is not connected</Text>

        {/* Custom styled button */}
        <TouchableOpacity style={styles.quitButton} onPress={handleQuit}>
          <Text style={styles.buttonText}>Quit</Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute", // Ensure it covers the entire screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // Ensure it's on top of everything else
  },
  warningBox: {
    backgroundColor: "rgba(255, 0, 0, 0.7)", // Red background with opacity
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  message: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginBottom: 25,
  },
  quitButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // Add some elevation for Android devices
  },
  buttonText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Overlay;
