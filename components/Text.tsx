import { Text as NativeText } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";
import { clsx } from "clsx";

export default function Text(props: React.ComponentProps<typeof NativeText> & { className?: string }) {
  const { colorScheme } = useColorScheme();

  return (
    <NativeText
      {...props}
      className={clsx(props.className)}
      style={[
        { color: Colors[colorScheme ?? "light"].text }, // Default color based on theme
        props.style, // Inline styles
      ]}
    >
      {props.children}
    </NativeText>
  );
}
