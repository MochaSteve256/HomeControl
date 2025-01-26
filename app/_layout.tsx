import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";

import { Colors } from "@/constants/Colors";
import "../global.css"; // Import your global CSS file
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    // Load color scheme preference from AsyncStorage
    const loadColorScheme = async () => {
      const savedScheme = await AsyncStorage.getItem("colorScheme");
      if (savedScheme) {
        if (savedScheme === "light" || savedScheme === "dark" || savedScheme === "system") {
          setColorScheme(savedScheme);
        } else {
          console.error(`Invalid color scheme saved: ${savedScheme}`);
        }
      }
    };

    loadColorScheme();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerTitle: "Home Control",
            headerStyle: {
              backgroundColor: Colors[colorScheme ?? "light"].header,
            },
            headerTitleStyle: {
              color: Colors["dark"].text,
            },
          }}
        />
      </Stack>
      <Toast visibilityTime={ 1000 } />
    </>
  );
}
