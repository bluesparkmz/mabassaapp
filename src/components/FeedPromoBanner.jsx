import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { ACCENT_LIGHT, BLACK, TEXT_MAIN } from "@/theme";

export default function FeedPromoBanner({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.92}
      style={{
        marginHorizontal: 20,
        marginTop: 16,
        backgroundColor: ACCENT_LIGHT,
        borderRadius: 20,
        padding: 18,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 17, fontWeight: "700", color: TEXT_MAIN, lineHeight: 24 }}>
          Vagas, serviços e talentos num só lugar
        </Text>
        <View
          style={{
            marginTop: 12,
            alignSelf: "flex-start",
            backgroundColor: BLACK,
            paddingHorizontal: 18,
            paddingVertical: 10,
            borderRadius: 22,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>Explorar</Text>
          <ChevronRight size={16} color="#fff" />
        </View>
      </View>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: "rgba(22, 163, 74, 0.15)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 32 }}>💼</Text>
      </View>
    </TouchableOpacity>
  );
}
