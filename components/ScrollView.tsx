import { ScrollView as NativeView, StyleSheet } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";

export default function View(props: React.ComponentProps<typeof NativeView>) {
    const { colorScheme } = useColorScheme();

    const styles = StyleSheet.create({
        container: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
            flex: 1,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 40,
            paddingBottom: 40,
        },
    });

    return (
        <NativeView {...props} style={styles.container}>
            <NativeView {...props} style={props.style} />
        </NativeView>
    );
}
