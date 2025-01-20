import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";

import { Colors } from "@/constants/Colors";

// Import your global CSS file
import "../global.css";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  const { colorScheme, setColorScheme} = useColorScheme();
  useEffect(() => {
    setColorScheme("system");
  }, [setColorScheme]);
  

  return (
    <>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ 
          headerTitle: "Home Control",
          headerStyle: { 
            backgroundColor: Colors[colorScheme ?? "light"].header
            },
          headerTitleStyle: {
            color: Colors["dark"].text
          }
          }} />
      </Stack>
    </>
  );
}
