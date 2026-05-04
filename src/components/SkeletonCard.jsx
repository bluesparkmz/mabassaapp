import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

function SkeletonBox({ width, height, borderRadius = 8, style }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: "#E2E8F0", opacity },
        style,
      ]}
    />
  );
}

export default function SkeletonCard() {
  return (
    <View
      pointerEvents="none"
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <SkeletonBox width={44} height={44} borderRadius={22} />
        <View style={{ marginLeft: 12, gap: 8 }}>
          <SkeletonBox width={120} height={12} />
          <SkeletonBox width={80} height={10} />
        </View>
      </View>
      <SkeletonBox width="100%" height={14} style={{ marginBottom: 8 }} />
      <SkeletonBox width="80%" height={12} style={{ marginBottom: 16 }} />
      <View style={{ flexDirection: "row", gap: 8 }}>
        <SkeletonBox width={100} height={36} borderRadius={10} />
        <SkeletonBox width={100} height={36} borderRadius={10} />
      </View>
    </View>
  );
}
