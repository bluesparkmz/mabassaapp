import React, { useState } from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { colors } from "@/theme";

/** Fallback initials — só tons de verde (primary) */
const AVATAR_GREENS = [
  colors.primary,
  colors.primaryDark,
  "#22C55E",
  "#10B981",
  "#059669",
];

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

  const colorIndex = name ? name.charCodeAt(0) % AVATAR_GREENS.length : 0;
  const bgColor = AVATAR_GREENS[colorIndex];

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
