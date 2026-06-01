import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";
import { SlidersHorizontal } from "lucide-react-native";
import { colors, BORDER, TEXT_MAIN } from "@/theme";

export default function FilterChips({
  options,
  selected,
  onSelect,
  style,
  contentPadding = 20,
  showFilterIcon = false,
  onFilterPress,
}) {
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
      {showFilterIcon && (
        <TouchableOpacity
          onPress={onFilterPress}
          activeOpacity={0.75}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: BORDER,
            backgroundColor: colors.white,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SlidersHorizontal size={18} color={TEXT_MAIN} strokeWidth={2} />
        </TouchableOpacity>
      )}
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
              backgroundColor: isSelected ? colors.black : colors.white,
              borderWidth: isSelected ? 0 : 0,
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
