import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Bell,
  Briefcase,
  Building2,
  CheckCheck,
  MessageCircle,
  Sparkles,
  UserRoundCheck,
} from "lucide-react-native";
import { notifications as initialNotifications } from "@/data/notificationsData";

const BLUE = "#2563EB";
const BG = "#F8FAFC";
const CARD = "#FFFFFF";

const notificationIcons = {
  job: Briefcase,
  service: Sparkles,
  profile: UserRoundCheck,
  company: Building2,
  message: MessageCircle,
};

const notificationColors = {
  job: "#2563EB",
  service: "#8B5CF6",
  profile: "#10B981",
  company: "#F59E0B",
  message: "#0EA5E9",
};

function NotificationCard({ item, onPress }) {
  const Icon = notificationIcons[item.type] || Bell;
  const color = notificationColors[item.type] || BLUE;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={{
        backgroundColor: item.unread ? "#EFF6FF" : CARD,
        borderWidth: 1,
        borderColor: item.unread ? "#BFDBFE" : "#E2E8F0",
        borderRadius: 16,
        padding: 14,
        flexDirection: "row",
        gap: 12,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          backgroundColor: color + "18",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={19} color={color} strokeWidth={2.4} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text
            numberOfLines={1}
            style={{ flex: 1, fontSize: 15, fontWeight: "800", color: "#0F172A" }}
          >
            {item.title}
          </Text>
          <Text style={{ fontSize: 12, color: "#64748B", fontWeight: "700" }}>
            {item.time}
          </Text>
        </View>
        <Text style={{ marginTop: 5, fontSize: 13, color: "#475569", lineHeight: 19 }}>
          {item.message}
        </Text>
      </View>
      {item.unread && (
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#EF4444",
            marginTop: 5,
          }}
        />
      )}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [items, setItems] = useState(initialNotifications);
  const unreadCount = useMemo(() => items.filter((item) => item.unread).length, [items]);

  const markAllRead = () => {
    setItems((current) => current.map((item) => ({ ...item, unread: false })));
  };

  const markRead = (id) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: BG, paddingTop: insets.top }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: CARD,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: "900", color: "#0F172A" }}>
            Notificacoes
          </Text>
          <Text style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>
            {unreadCount ? `${unreadCount} por ler` : "Tudo em dia"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={markAllRead}
          disabled={!unreadCount}
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: unreadCount ? BLUE : "#E2E8F0",
            alignItems: "center",
            justifyContent: "center",
            opacity: unreadCount ? 1 : 0.7,
          }}
        >
          <CheckCheck size={20} color={unreadCount ? "#fff" : "#64748B"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: insets.bottom + 24 }}
      >
        {items.length ? (
          items.map((item) => (
            <NotificationCard key={item.id} item={item} onPress={() => markRead(item.id)} />
          ))
        ) : (
          <View
            style={{
              backgroundColor: CARD,
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#E2E8F0",
            }}
          >
            <Bell size={28} color="#94A3B8" />
            <Text style={{ marginTop: 10, fontSize: 15, fontWeight: "800", color: "#0F172A" }}>
              Sem notificacoes
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
