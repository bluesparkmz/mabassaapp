import React from "react";
import { View } from "react-native";
import { BG, BORDER } from "@/theme";

/** Header fixo com borda inferior — referência Job List */
export default function ScreenFixedHeader({
  insets,
  children,
  paddingBottom = 12,
  noBorder = false,
}) {
  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: BG,
        borderBottomWidth: noBorder ? 0 : 1,
        borderBottomColor: BORDER,
        paddingBottom,
      }}
    >
      {children}
    </View>
  );
}
