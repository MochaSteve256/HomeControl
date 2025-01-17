import { Button, Text, View } from "react-native";
import * as Haptics from 'expo-haptics';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button title="Press me" onPress={() => {
        console.log("pressed")
        Haptics.selectionAsync();
        }} />
    </View>
  );
}
