import React from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import { useApi } from "@/components/ApiContext";
import Lock from "@/components/Lock"; // Assume Lock is the lock component

const { width, height } = Dimensions.get("window");
const GRID_SIZE = 8;
const BOARD_SIZE = Math.min(width, height); // Ensure board is smaller than the screen size
const SQUARE_SIZE = BOARD_SIZE / GRID_SIZE;

const ChessGrid = () => {
  const { isOn, loggedIn } = useApi(); // Use the API context to get the isOn and loggedIn states

  // Identify the center 16 squares (4x4 in the middle of an 8x8 grid)
  const centerSquares = [
    18, 19, 20, 21, 26, 27, 28, 29, 34, 35, 36, 37, 42, 43, 44, 45,
  ];

  const generateGridData = () => {
    return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
      const isCenterSquare = centerSquares.includes(index);

      // If loggedIn is false and isOn is true, color the center squares yellow
      const color =
        isOn && !loggedIn && isCenterSquare
          ? "#696969"
          : (Math.floor(index / GRID_SIZE) + (index % GRID_SIZE)) % 2 === 0
          ? "black"
          : "white";

      return {
        id: index.toString(),
        color: color,
      };
    });
  };

  const renderSquare = ({ item }: { item: { id: string; color: string } }) => (
    <View style={[styles.square, { backgroundColor: item.color }]}></View>
  );

  return (
    <View style={styles.container}>
      {!isOn ? (
        // When isOn is false, always display only the chessboard
        <FlatList
          data={generateGridData()}
          renderItem={renderSquare}
          keyExtractor={(item) => item.id}
          numColumns={GRID_SIZE}
          scrollEnabled={false}
          style={styles.grid}
        />
      ) : loggedIn ? null : ( // State 2: loggedIn True, isOn True -> show a new component
        // State 1: loggedIn False, isOn True -> show chessboard and lock with center squares yellow
        <>
          <FlatList
            data={generateGridData()}
            renderItem={renderSquare}
            keyExtractor={(item) => item.id}
            numColumns={GRID_SIZE}
            scrollEnabled={false}
            style={styles.grid}
          />
          <Lock />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  grid: {
    width: BOARD_SIZE, // Set the grid size to be the board size
    height: BOARD_SIZE, // Ensures the grid is square
    position: "relative", // Allow overlaying elements
  },
  square: {
    width: SQUARE_SIZE, // Square size based on the grid
    height: SQUARE_SIZE,
  },
});

export default ChessGrid;
