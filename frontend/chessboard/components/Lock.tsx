import React, { useState } from "react";
import { StyleSheet, Dimensions, View, TouchableOpacity } from "react-native";
import { useApi } from "@/components/ApiContext"; // Import useApi to access context

const { width, height } = Dimensions.get("window");
const BOARD_SIZE = Math.min(width, height); // Chessboard size
const GRID_SIZE = 8; // Chessboard grid size (8x8)
const PIN_GRID_SIZE = 4; // Lock pattern grid size (4x4)
const SQUARE_SIZE = BOARD_SIZE / GRID_SIZE; // Size of each chess square

const CORRECT_PIN_SEQUENCE = [18, 19, 26, 27]; // Example: correct pattern based on the 4x4 center squares

const Lock: React.FC = () => {
  const { setLoggedIn } = useApi(); // Access setLoggedIn from the context
  const [selectedSquares, setSelectedSquares] = useState<number[]>([]); // Track selected squares

  // Handle square press
  const handleSquarePress = (index: number) => {
    if (!selectedSquares.includes(index) && selectedSquares.length < 4) {
      const newSelectedSquares = [...selectedSquares, index];
      setSelectedSquares(newSelectedSquares);

      // Check if the selected sequence matches the correct pin
      if (newSelectedSquares.length === 4) {
        if (
          JSON.stringify(newSelectedSquares) ===
          JSON.stringify(CORRECT_PIN_SEQUENCE)
        ) {
          setLoggedIn(true); // Unlock if correct
        } else {
          resetPin(); // Reset if incorrect
        }
      }
    }
  };

  // Reset the selected pin sequence
  const resetPin = () => {
    setSelectedSquares([]);
  };

  // Generate the color for each square in the lock pattern based on its index
  const generateSquareColor = (index: number) => {
    // Get the position of the square within the 8x8 chessboard grid
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    // Alternating chessboard color logic
    const isBlackSquare = (row + col) % 2 === 0;
    const defaultColor = isBlackSquare ? "black" : "white";

    return selectedSquares.includes(index) ? "yellow" : defaultColor; // Change color when selected
  };

  // Render the lock pattern grid (4x4 center squares in the chessboard)
  const renderGrid = () => {
    // Center 4x4 squares of the 8x8 chessboard
    const centerSquares = [
      18, 19, 20, 21, 26, 27, 28, 29, 34, 35, 36, 37, 42, 43, 44, 45,
    ];

    return centerSquares.map((index) => (
      <TouchableOpacity
        key={index}
        style={[styles.square, { backgroundColor: generateSquareColor(index) }]}
        onPress={() => handleSquarePress(index)}
      />
    ));
  };

  return <View style={styles.lockContainer}>{renderGrid()}</View>;
};

const styles = StyleSheet.create({
  lockContainer: {
    position: "absolute", // Overlay on the chessboard
    top: SQUARE_SIZE * 2, // Position the lock in the center 4x4 squares
    left: SQUARE_SIZE * 2,
    width: SQUARE_SIZE * PIN_GRID_SIZE, // Ensure the lock fits the 4x4 grid
    height: SQUARE_SIZE * PIN_GRID_SIZE,
    zIndex: 1, // Ensure it is above the chessboard
    flexDirection: "row",
    flexWrap: "wrap",
  },
  square: {
    width: SQUARE_SIZE, // Each square size
    height: SQUARE_SIZE,
  },
});

export default Lock;
