import React from "react";
import { ScrollView, TouchableOpacity, Text, View } from "react-native";

const BLUE = "#2563EB";
const LIGHT_BLUE = "#EFF6FF";
const GRAY = "#64748B";
const BORDER = "#E2E8F0";

export default function FilterChips({ options, selected, onSelect, style }) {
  return (
    <ScrollView
      horizontal
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 8,
        paddingVertical: 4,
      }}
      style={[{ flexGrow: 0 }, style]}
    >
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option)}
            activeOpacity={0.7}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: isSelected ? BLUE : "#FFFFFF",
              borderWidth: 1.5,
              borderColor: isSelected ? BLUE : BORDER,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isSelected ? 0.12 : 0.04,
              shadowRadius: 4,
              elevation: isSelected ? 2 : 1,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: isSelected ? "600" : "500",
                color: isSelected ? "#FFFFFF" : GRAY,
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
