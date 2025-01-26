import { dismissAlarm, getPSUStatus, setLED, setPSU, wakePC } from "@/services/api";
import Text from "@/components/Text";
import View from "@/components/View";
import Button from "@/components/Button";
import {
  View as NativeView,
  Vibration,
  Switch,
  SafeAreaView,
} from "react-native";
import { useState, useEffect } from "react";

export default function ControlsScreen() {
  const [psuOn, setPsuOn] = useState<boolean>(false);

  // Fetch PSU status when the component mounts
  useEffect(() => {
    async function fetchPSUStatus() {
      const status = await getPSUStatus();
      if (status !== null) {
        setPsuOn(status);
      }
    }

    fetchPSUStatus();
  }, []); // Runs only on mount

  const handlePSUchange = async () => {
    const updatedStatus = await setPSU(!psuOn); // Toggle PSU status via API
    setPsuOn(updatedStatus); // Update state based on API success
  };


  async function customLED() {
    // color picker
  }

  return (
    <View>
      <Text className="text-xl font-bold">Misc.</Text>
      <SafeAreaView style={{ flexDirection: "row" }}>
        <Button className="ml-0 py-5" title="START PC" onPress={wakePC} />
        <Button className="py-5 px-2" title="DISMISS ALARM" onPress={dismissAlarm} />
        <Button className="mr-0 py-5 px-1" onPress={handlePSUchange}>
          <SafeAreaView className="flex-row items-center">
            <Text className="px-5" style={{ color: "white" }} >PSU </Text>
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
          </SafeAreaView>
        </Button>
      </SafeAreaView>
      <Text className="text-xl font-bold">LED Control</Text>
      <SafeAreaView className="flex-row items-center">
        <Button className="ml-0 py-10 px-10" title="OFF" onPress={() => setLED("BLACK")} />
        <Button className="py-10 px-10" title=" RGB " onPress={() => setLED("RGB")} />
        <Button className="mr-0 py-10 px-10" title=" ARGB " onPress={() => setLED("ARGB")} />
      </SafeAreaView>
      <SafeAreaView className="flex-row items-center">
        <Button className="ml-0 py-10 px-7" title=" WHITE " onPress={() => setLED("WHITE")} />
        <Button className="py-10 px-1" title="WARM WHITE" onPress={() => setLED("WARM_WHITE")} />
        <Button className="mr-0 py-10 px-" title="COLD WHITE" onPress={() => setLED("COLD_WHITE")} />
      </SafeAreaView>
      <SafeAreaView className="flex-row items-center">
        <Button className="ml-0 py-10 px-10" title=" CUSTOM " onPress={customLED} />
      </SafeAreaView>
    </View>
  );
}
