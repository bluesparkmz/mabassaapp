import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { BORDER, feedCardStyle } from "@/theme";

function SkeletonBox({ width, height, borderRadius = 8, style }) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.75, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.35, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: BORDER, opacity },
        style,
      ]}
    />
  );
}

export default function SkeletonCard() {
  return (
    <View pointerEvents="none" style={feedCardStyle}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
        <SkeletonBox width={48} height={48} borderRadius={24} />
        <View style={{ marginLeft: 12, gap: 8, flex: 1 }}>
          <SkeletonBox width="70%" height={14} />
          <SkeletonBox width="45%" height={11} />
        </View>
      </View>
      <SkeletonBox width={80} height={22} borderRadius={8} style={{ marginBottom: 12 }} />
      <SkeletonBox width="100%" height={12} style={{ marginBottom: 8 }} />
      <SkeletonBox width="85%" height={12} style={{ marginBottom: 14 }} />
      <SkeletonBox width={110} height={36} borderRadius={20} />
    </View>
  );
}
