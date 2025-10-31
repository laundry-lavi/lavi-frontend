import React from "react";
import { View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface StarRatingProps {
  rating: number;
  starSize?: number;
  color?: string;
}

function StarRating({
  rating,
  starSize = 24,
  color = "#FFD700",
}: StarRatingProps) {
  const stars = [];
  const totalStars = 5;

  for (let i = 1; i <= totalStars; i++) {
    if (i <= rating) {
      stars.push(
        <Ionicons key={i} name="star" size={starSize} color={color} />
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <Ionicons
          key={i}
          name="star-half-sharp"
          size={starSize}
          color={color}
        />
      );
    } else {
      stars.push(
        <Ionicons key={i} name="star-outline" size={starSize} color={color} />
      );
    }
  }

  return <View style={styles.container}>{stars}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default StarRating;
