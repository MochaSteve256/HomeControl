import { TextInput as NativeTextInput } from "react-native";

import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";

export default function TextInput(props: React.ComponentProps<typeof NativeTextInput>) {
    const { colorScheme, setColorScheme } = useColorScheme();
    return <NativeTextInput {...props} autoComplete="off"
      style={[props.style, { 
        color: Colors[colorScheme ?? "light"].text
    }]} />;
}