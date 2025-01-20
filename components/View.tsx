import { View as NativeView, StyleSheet } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";

export default function View(props: React.ComponentProps<typeof NativeView>) {
    const { colorScheme } = useColorScheme();

    const styles = StyleSheet.create({
        container: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
            flex: 1,
            padding: 20,
        },
    });

    return (
        <NativeView {...props} style={styles.container}>
            <NativeView {...props} style={props.style} />
        </NativeView>
    );
}
