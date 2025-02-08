import { TextInput as NativeTextInput, StyleSheet } from "react-native";

import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";

export default function TextInput(props: React.ComponentProps<typeof NativeTextInput>) {
  const { colorScheme, setColorScheme } = useColorScheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: Colors[colorScheme ?? "light"].background,
      color: Colors[colorScheme ?? "light"].text,
      borderWidth: 2,
      padding: 10,
      borderColor: Colors[colorScheme ?? "light"].tint,
      borderRadius: 5,
    }
  });

  return <NativeTextInput {...props} autoComplete="off"
    style={[props.style, styles.container]} placeholderTextColor={Colors[colorScheme ?? "light"].disabled} />;
}