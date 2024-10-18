// Index.tsx
import { Text, View, SafeAreaView, StyleSheet, Dimensions, StatusBar } from "react-native";
import React from "react";
import ChessGrid from "@/components/Chessboard";
import { ApiProvider, useApi } from "@/components/ApiContext"; // Combine imports
import Overlay from "@/components/Overlay"; // Import the overlay component
import CalendarListComponent from "@/components/Calendar"; // Import the calendar component

const { width, height } = Dimensions.get("window");
const BOARD_SIZE = Math.min(width, height);

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true}/>
      <ApiProvider>
        <Content />
      </ApiProvider>
    </SafeAreaView>
  );
}

const Content = () => {
  const { isOn, loggedIn } = useApi(); // Access context states
  const bool = (isOn && loggedIn) || (!isOn && loggedIn);
  return (
    <>
      {bool ? (
        <CalendarListComponent />
      ) : (
        <View style={styles.gridWrapper}>
          <ChessGrid />
        </View>
      )}
      {!isOn && loggedIn && <Overlay />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full height of the screen
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
  },
  gridWrapper: {
    flex: 1, // Ensures ChessGrid can expand within available space
    justifyContent: "center",
    alignItems: "center",
    width: BOARD_SIZE, // Set the grid size to the screen size
    height: BOARD_SIZE,
    position: "relative", // Allow Overlay to be positioned absolutely over this
  },
  test: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightblue",
  },
});
