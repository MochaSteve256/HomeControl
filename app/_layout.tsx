import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";

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
      <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
