 import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";

const PURPLE = "#6C5DD3";
const TEXT_MAIN = "#11142D";
const BORDER = "#E2E8F0";
const CARD = "#FFFFFF";

export default function FilterChips({ options, selected, onSelect, style }) {
  return (
    <ScrollView
      horizontal
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        gap: 10,
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
              paddingVertical: 11,
              borderRadius: 18,
              backgroundColor: isSelected ? PURPLE : CARD,
              borderWidth: 1,
              borderColor: isSelected ? PURPLE : "#EEF2F7",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isSelected ? 0.08 : 0.03,
              shadowRadius: 8,
              elevation: isSelected ? 3 : 1,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: isSelected ? "700" : "600",
                color: isSelected ? "#FFFFFF" : TEXT_MAIN,
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
