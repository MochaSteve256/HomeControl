import { Text as NativeText } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";

export default function View(props: React.ComponentProps<typeof NativeText>) {
    const { colorScheme, setColorScheme } = useColorScheme();

    return <NativeText {...props} style={[props.style, { 
        color: Colors[colorScheme ?? "light"].text
    }] } />;
}
