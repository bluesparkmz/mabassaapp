import { Tabs } from "expo-router";
import { Home, Building2, Briefcase, Users, User } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BLUE = "#2563EB";
const GRAY = "#94A3B8";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
          height: 62 + bottomInset,
          paddingTop: 6,
          paddingBottom: bottomInset,
          elevation: 24,
          zIndex: 100,
        },
        tabBarActiveTintColor: BLUE,
        tabBarInactiveTintColor: GRAY,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 0,
          marginBottom: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ color, focused }) => (
            <Home size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="empresas"
        options={{
          title: "Empresas",
          tabBarIcon: ({ color, focused }) => (
            <Building2
              size={22}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="vagas"
        options={{
          title: "Vagas",
          tabBarIcon: ({ color, focused }) => (
            <Briefcase
              size={22}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="freelancers"
        options={{
          title: "Freelancers",
          tabBarIcon: ({ color, focused }) => (
            <Users size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <User size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}
