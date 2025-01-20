import Text from "@/components/Text";
import View from "@/components/View";
import TextInput from "@/components/TextInput";


export default function OptionsScreen() {
    return (
        <View>
            <Text>Server URL</Text>
            <TextInput placeholder="http://server:port" />
        </View>
    );
}