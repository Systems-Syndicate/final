import React, { useEffect, useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { useApi } from "@/components/ApiContext"; // Import useApi to access context
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChessKnight } from "@fortawesome/free-solid-svg-icons/faChessKnight";

const { width, height } = Dimensions.get("window");
const BOARD_SIZE = Math.min(width, height); // Chessboard size
const ICON_SIZE = 40; // Size of each user icon
const backendURL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.64.223:3801";

const UserIndicator: React.FC = () => {
  const { isOn, loggedIn } = useApi(); // Access isOn and loggedIn from the context
  const [activeUsers, setActiveUsers] = useState<string[]>([]); // Store active user colors

  // Fetch active users every second
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`${backendURL}/active_users`); // Fetch active users
        const data = await response.json();
        console.log("Fetched active users:", data); // Log response data
        if (Array.isArray(data) && Array.isArray(data[0])) {
          setActiveUsers(data[0]); // Store the list of colors (first element)
        } else {
          console.error("Unexpected data format:", data);
          setActiveUsers([]); // Reset users if fetch fails
        }
      } catch (error) {
        console.error("Error fetching active users:", error);
        setActiveUsers([]); // Reset users if fetch fails
      }
    }, 1000); // Polling interval set to 1 second

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [isOn, loggedIn]);

  if (!isOn || loggedIn || activeUsers.length === 0) {
    return null; // Do not render anything if isOn is false or loggedIn is true
  }

  // Dynamically calculate the positions of the icons in a circular/polygon layout
  const radius = 50; // Radius of the circle layout
  const centerX = radius + 10; // X coordinate of the circle center
  const centerY = radius + 10; // Y coordinate of the circle center

  // Function to calculate the position for each icon based on the number of users
  const getIconPosition = (index: number, totalUsers: number) => {
    const angle = (2 * Math.PI * index) / totalUsers; // Angle for each icon
    const x = centerX + radius * Math.cos(angle); // X position
    const y = centerY + radius * Math.sin(angle); // Y position
    return { left: x, top: y }; // Return calculated position
  };

  return (
    <View style={styles.container}>
      {activeUsers.map((color, index) => {
        const position = getIconPosition(index, activeUsers.length); // Get position
        return (
          <View
            key={index}
            style={[
              styles.iconContainer,
              position, // Apply dynamic position to each icon
            ]}
          >
            <FontAwesomeIcon
              icon={faChessKnight}
              size={ICON_SIZE}
              style={{ color }} // Set the icon color from the active user colors
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10, // Adjust the distance from the top of the chessboard
    left: 10, // Adjust the distance from the left of the chessboard
    width: BOARD_SIZE, // Size of the container
    height: BOARD_SIZE, // Size of the container
  },
  iconContainer: {
    position: "absolute", // Each icon is positioned absolutely
    width: ICON_SIZE,
    height: ICON_SIZE,
    margin: 5, // Space between icons
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserIndicator;
