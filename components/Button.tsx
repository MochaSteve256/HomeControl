import { Pressable, Text, Vibration } from "react-native";
import { useRef } from "react";
import { useColorScheme } from "nativewind";


function Button({ title, onPress }: { title: string; onPress: () => void }) {

  const { colorScheme, setColorScheme} = useColorScheme();
  const pressStartTime = useRef<number | null>(null);

  return (
    
    <Text
      style={{
        //if colorScheme == dark
        backgroundColor: colorScheme === "dark" ? "rgb(50, 0, 200)" : "rgb(100, 150, 255)",
        color: colorScheme === "dark" ? "white" : "black",
        margin: 10,
        borderRadius: 10,
        padding: 10,
        
      }}

      onPress={() => {
        onPress();
      }}
      onPressIn={() => {
        pressStartTime.current = Date.now(); // Record the press start time
        Vibration.vibrate(10); // Vibrate on press in
      }}
      onPressOut={() => {
        const pressDuration = Date.now() - (pressStartTime.current || 0);
        pressStartTime.current = null; // Reset the time

        if (pressDuration >= 200) {
          // If the press is long enough, vibrate again
          Vibration.vibrate(3);
        }
      }}
    >
      {title}
    </Text>
  );
}

export default Button;
