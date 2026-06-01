import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Bell, MessageCircle, Search, X } from "lucide-react-native";
import { useRouter } from "expo-router";
import MabassaAvatar from "@/components/MabassaAvatar";
import {
  BG,
  BG_SOFT,
  BORDER,
  TEXT_MAIN,
  TEXT_SUB,
  getGreeting,
} from "@/theme";

export default function HomeHeader({
  userName,
  userAvatar,
  searchText,
  onSearchChange,
  searchPlaceholder = "Pesquisar vagas, posts e serviços...",
  paddingTop = 0,
  onAvatarPress,
}) {
  const router = useRouter();
  const displayName = userName?.trim() || "visitante";
  const firstName = displayName.split(" ")[0];

  return (
    <View style={{ paddingTop, paddingHorizontal: 20, paddingBottom: 4 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <TouchableOpacity
          onPress={onAvatarPress}
          activeOpacity={0.85}
          style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
          disabled={!onAvatarPress}
        >
          <MabassaAvatar
            uri={userAvatar}
            name={displayName}
            size={46}
            borderRadius={23}
          />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontSize: 13, color: TEXT_SUB, fontWeight: "500" }}>
              {getGreeting()}
            </Text>
            <Text
              style={{ fontSize: 20, color: TEXT_MAIN, fontWeight: "700", marginTop: 2 }}
              numberOfLines={1}
            >
              {firstName}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            activeOpacity={0.8}
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: BG_SOFT,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MessageCircle size={20} color={TEXT_MAIN} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            activeOpacity={0.8}
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: BG_SOFT,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={20} color={TEXT_MAIN} strokeWidth={2} />
            <View
              style={{
                position: "absolute",
                top: 10,
                right: 11,
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: "#EF4444",
                borderWidth: 1.5,
                borderColor: BG_SOFT,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: BG_SOFT,
          borderRadius: 28,
          paddingHorizontal: 18,
          minHeight: 52,
          borderWidth: 1,
          borderColor: BORDER,
        }}
      >
        <TextInput
          value={searchText}
          onChangeText={onSearchChange}
          placeholder={searchPlaceholder}
          placeholderTextColor={TEXT_SUB}
          style={{ flex: 1, fontSize: 15, color: TEXT_MAIN, fontWeight: "400", paddingVertical: 14 }}
        />
        {searchText ? (
          <TouchableOpacity
            onPress={() => onSearchChange("")}
            activeOpacity={0.7}
            style={{ marginRight: 4 }}
          >
            <X size={18} color={TEXT_SUB} />
          </TouchableOpacity>
        ) : (
          <Search size={20} color={TEXT_SUB} strokeWidth={2} />
        )}
      </View>
    </View>
  );
}
