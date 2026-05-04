import React, { useState } from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";

export default function MabassaAvatar({ uri, name, size = 44, borderRadius }) {
  const [error, setError] = useState(false);
  const radius = borderRadius !== undefined ? borderRadius : size / 2;
  const initials = name
    ? name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "?";

  const bgColors = ["#2563EB", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];
  const colorIndex = name ? name.charCodeAt(0) % bgColors.length : 0;
  const bgColor = bgColors[colorIndex];

  if (error || !uri) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: bgColor,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{ color: "#fff", fontWeight: "700", fontSize: size * 0.38 }}
        >
          {initials}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size, borderRadius: radius }}
      contentFit="cover"
      onError={() => setError(true)}
    />
  );
}
