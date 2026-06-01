import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";
import { colors } from "@/theme";

export default function FilterChips({ options, selected, onSelect, style, contentPadding = 20 }) {
  return (
    <ScrollView
      horizontal
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: contentPadding,
        gap: 8,
        paddingVertical: 4,
        alignItems: "center",
      }}
      style={[{ flexGrow: 0 }, style]}
    >
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option)}
            activeOpacity={0.75}
            style={{
              paddingHorizontal: 18,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: isSelected ? colors.black : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: isSelected ? "600" : "500",
                color: isSelected ? "#FFFFFF" : colors.textSecondary,
              }}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
