import { Tabs } from "expo-router";
import { Home, Briefcase, Compass, Bookmark, Settings } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PURPLE = "#6C5DD3";
const GRAY = "#808191";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);
  const renderTabIcon = (Icon, color, focused) => (
    <View
      style={{
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? PURPLE + "14" : "transparent",
      }}
    >
      <Icon size={22} color={color} strokeWidth={focused ? 2.4 : 2} />
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          height: 72 + bottomInset,
          paddingTop: 8,
          paddingBottom: bottomInset,
          paddingHorizontal: 10,
          elevation: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.07,
          shadowRadius: 18,
          zIndex: 100,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        },
        tabBarActiveTintColor: PURPLE,
        tabBarInactiveTintColor: GRAY,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2,
          marginBottom: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            renderTabIcon(Home, color, focused)
          ),
        }}
      />
      <Tabs.Screen
        name="empresas"
        options={{
          title: "Empresas",
          tabBarIcon: ({ color, focused }) => (
            renderTabIcon(Compass, color, focused)
          ),
        }}
      />
      <Tabs.Screen
        name="vagas"
        options={{
          title: "Vagas",
          tabBarIcon: ({ color, focused }) => (
            renderTabIcon(Briefcase, color, focused)
          ),
        }}
      />
      <Tabs.Screen
        name="freelancers"
        options={{
          title: "Talentos",
          tabBarIcon: ({ color, focused }) => (
            renderTabIcon(Bookmark, color, focused)
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            renderTabIcon(Settings, color, focused)
          ),
        }}
      />
    </Tabs>
  );
}
