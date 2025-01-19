import { Text, View } from "react-native";

import Button from "../components/Button";

export default function Index() {
  return (
    <View className="dark:bg-gray-900 flex-1 items-center justify-center">
      <Text className="dark:text-white">Edit app/index.tsx to edit this screen.</Text>
      <Button title="Press me" onPress={() => console.log("Pressed")}/>
    </View>
  );
}
