import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from 'react-native';
import { useColorScheme } from "nativewind";

import { Colors } from "@/constants/Colors";
import TabBarBackground from '@/components/TabBarBackground';
import { HapticTab } from "@/components/HapticTab";

export default function TabLayout() {

  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
        }}>
        <Tabs.Screen name="index" options={{ 
          headerShown: false,
          title: "Controls",
          tabBarIcon: ({ color, focused }) => <Ionicons size={28} name={focused ? "options-sharp" : "options-outline"} color={color} />,
        }} />
        <Tabs.Screen name="automations" options={{ 
          headerShown: false,
          title: "Automations",
          tabBarIcon: ({ color, focused }) => <Ionicons size={28} name={focused ? "alarm-sharp" : "alarm-outline"} color={color} />,
        }} />
        <Tabs.Screen name="options" options={{ 
          headerShown: false,
          title: "Options",
          tabBarIcon: ({ color, focused }) => <Ionicons size={28} name={focused ? "settings-sharp" : "settings-outline"} color={color} />,
        }} />
      </Tabs>
    </>
  );
}
