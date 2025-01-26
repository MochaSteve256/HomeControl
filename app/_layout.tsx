import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";

import { Colors } from "@/constants/Colors";
import "../global.css"; // Import your global CSS file
import { StatusBar } from "expo-status-bar";
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  setColorScheme("dark");

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
      <Toast/>
    </>
  );
}
