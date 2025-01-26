import { wakePC } from "@/services/api";
import Text from "@/components/Text";
import View from "@/components/View";
import Button from "@/components/Button";
import {
  View as NativeView,
  Vibration,
  Switch,
  SafeAreaView,
} from "react-native";
import { useState } from "react";

export default function ControlsScreen() {
  const [psuOn, setPsuOn] = useState<boolean>(false); //TODO get first value from api
  const handlePSUchange = () => {
    setPsuOn(!psuOn);
    //TODO send rest api request
  };

  return (
    <View>
      <Text className="text-xl font-bold">Misc.</Text>
      <SafeAreaView style={{ flexDirection: "row" }}>
        <Button
          className="ml-0 py-5 px-2"
          title="START PC"
          onPress={() => wakePC()}
        />
        <Button className="py-5" title="DISMISS ALARM" onPress={() => {}} />
        <Button className="mr-0 py-0 px-3" onPress={() => handlePSUchange()}>
          <NativeView className="flex-row items-center py-10">
            <Text className="mx-3">PSU</Text>
            <Switch
              className="mr-3"
              thumbColor={"white"}
              trackColor={{ false: "darkred", true: "lightgreen" }}
              value={psuOn}
              onValueChange={() => {
                handlePSUchange();
                Vibration.vibrate(10);
              }}
            />
          </NativeView>
        </Button>
      </SafeAreaView>
      <Text className="text-xl font-bold">LED Control</Text>
      <SafeAreaView style={{ flexDirection: "row" }}></SafeAreaView>
    </View>
  );
}
