import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { Vibration } from "react-native";

export function HapticTab({ onPressIn, ...restProps }: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...restProps}
      onPressIn={(event) => {
        Vibration.vibrate(10); // Trigger the vibration
        if (onPressIn) {
          onPressIn(event); // Ensure any existing `onPressIn` logic is executed
        }
      }}
    />
  );
}
