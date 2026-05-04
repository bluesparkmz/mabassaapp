import React from "react";
import { View, Text } from "react-native";
import { Star } from "lucide-react-native";

export default function StarRating({
  rating,
  reviews,
  size = 12,
  showCount = true,
}) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} size={size} color="#F59E0B" fill="#F59E0B" />
      ))}
      {hasHalf && <Star size={size} color="#F59E0B" fill="#FDE68A" />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} size={size} color="#D1D5DB" fill="#D1D5DB" />
      ))}
      {showCount && (
        <Text
          style={{
            fontSize: size,
            fontWeight: "600",
            color: "#0F172A",
            marginLeft: 2,
          }}
        >
          {rating.toFixed(1)}
        </Text>
      )}
      {showCount && reviews !== undefined && (
        <Text style={{ fontSize: size - 1, color: "#94A3B8" }}>
          ({reviews})
        </Text>
      )}
    </View>
  );
}
