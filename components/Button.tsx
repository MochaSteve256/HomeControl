import React, { useRef } from "react";
import {
  Text,
  Vibration,
  View,
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  Pressable,
} from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";

const Button = ({
  title,
  onPress,
  className,
  children,
}: {
  title?: string;
  onPress: () => void;
  className?: string;
  children?: React.ReactNode;
}) => {
  const { colorScheme } = useColorScheme();
  const pressStartTime = useRef<number | null>(null);

  const defaultStyles = StyleSheet.create({
  button: {
    backgroundColor: Colors[colorScheme ?? "light"].tint,
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 1, // Add this to allow content to shrink
  },
  text: {
    color: Colors["dark"].text,
    textAlign: "center",
    fontSize: 16,
    flexShrink: 1, // Ensure text can shrink if needed
    flexWrap: "wrap", // Allow text to wrap
  },
});

  const rippleBackground =
    Platform.OS === "android" && Platform.Version >= 21
      ? TouchableNativeFeedback.Ripple(
          Colors[colorScheme ?? "light"].background,
          false,
        )
      : undefined;

  const content = (
    <View className={className} style={defaultStyles.button}>
      {children ? (
        children
      ) : (
        <Text className="text-center" style={defaultStyles.text}>
          {title}
        </Text>
      )}
    </View>
  );

  return Platform.OS === "android" && Platform.Version >= 21 ? (
    <TouchableNativeFeedback
      onPress={onPress}
      background={rippleBackground}
      onPressIn={() => {
        pressStartTime.current = Date.now();
        Vibration.vibrate(10);
      }}
      onPressOut={() => {
        const pressDuration = Date.now() - (pressStartTime.current || 0);
        pressStartTime.current = null;

        if (pressDuration >= 200) {
          Vibration.vibrate(3);
        }
      }}
    >
      {content}
    </TouchableNativeFeedback>
  ) : (
    <Pressable
      onPress={onPress}
      style={{ borderRadius: 10 }}
      onPressIn={() => {
        pressStartTime.current = Date.now();
        Vibration.vibrate(10);
      }}
      onPressOut={() => {
        const pressDuration = Date.now() - (pressStartTime.current || 0);
        pressStartTime.current = null;

        if (pressDuration >= 200) {
          Vibration.vibrate(3);
        }
      }}
    >
      {content}
    </Pressable>
  );
};

export default Button;
