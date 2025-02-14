import { dismissAlarm, getPSUStatus, setLED, setPSU, wakePC } from "@/services/api";
import Text from "@/components/Text";
import ScrollView from "@/components/ScrollView";
import Button from "@/components/Button";
import {
  Vibration,
  Switch,
  SafeAreaView,
  Modal,
  View,
  StyleSheet,
} from "react-native";
import Slider from '@react-native-community/slider';
import ColorPicker, { Panel1, Panel2, Panel3, Swatches, Preview, OpacitySlider, HueSlider, BrightnessSlider, colorKit } from 'reanimated-color-picker';
import { Colors } from "@/constants/Colors";
import { useState, useEffect } from "react";
import { useColorScheme } from "nativewind";
import { GestureHandlerRootView, Pressable, TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function ControlsScreen() {
  const [psuOn, setPsuOn] = useState<boolean>(false);

  const { colorScheme } = useColorScheme();

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

  const [showColorModal, setShowColorModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    contentContainer: {
      width: '80%',
      height: '72%',
      backgroundColor: Colors[colorScheme ?? "light"].background,
      borderRadius: 12,
      borderColor: Colors[colorScheme ?? "light"].text,
      borderWidth: 2,
      padding: 20,
    },
    componentMargin: {
      justifyContent: 'center',
      marginVertical: 8,
      marginHorizontal: 2,
    },
  });

  async function customLED() {
    setShowColorModal(true);
  }

  async function moreLED() {
    // modal for sunrise, sunset and alarm
  }

  return (
    <>
      <ScrollView>
        <Text className="text-2xl font-bold">Misc.</Text>
        <SafeAreaView className="flex-row space-x-4">
          <Button className="ml-0 w-32 h-24" title=" START PC " onPress={wakePC} />
          <Button className="w-32 h-24" title="DISMISS ALARM" onPress={dismissAlarm} />
          <Button className="mr-0 w-32 h-24" onPress={handlePSUchange}>
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
        <Text className="text-2xl font-bold">LED Control</Text>
        <Text className="text-lg font-bold">Misc.</Text>
        <SafeAreaView className="flex-row space-x-4 mb-1">
          <Button className="ml-0 w-32 h-24" title="OFF" onPress={() => setLED("BLACK")} />
          <Button className="w-32 h-24" title="CUSTOM " onPress={customLED} />
          <Button className="mr-0 w-32 h-24" title=" ••• " onPress={moreLED} />
        </SafeAreaView>
        <Text className="text-lg font-bold">Special</Text>
        <SafeAreaView className="flex-row space-x-4 mb-1">
          <Button className="ml-0 w-32 h-24" title=" RGB " onPress={() => setLED("RGB")} />
          <Button className="mr-0 w-32 h-24" title=" ARGB " onPress={() => setLED("ARGB")} />
        </SafeAreaView>
        <Text className="text-lg font-bold">White tones</Text>
        <SafeAreaView className="flex-row space-x-4">
          <Button className="ml-0 w-32 h-24" title=" WHITE " onPress={() => setLED("WHITE")} />
          <Button className="w-32 h-24" title="WARM WHITE" onPress={() => setLED("WARM_WHITE")} />
          <Button className="mr-0 w-32 h-24" title="COLD WHITE " onPress={() => setLED("COLD_WHITE")} />
        </SafeAreaView>
        <Text className="font-bold mt-1">Brightness</Text>
        <Slider
          style={{ flex: 1, marginTop: 10 }}
          thumbTintColor={Colors[colorScheme ?? "light"].tint}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#FFFFFF"
          onSlidingStart={() => Vibration.vibrate(10)}
          onSlidingComplete={() => Vibration.vibrate(10)}
        />
        <Text className="font-bold mt-1">Hue</Text>
        <Slider
          style={{ flex: 1, marginTop: 10 }}
          thumbTintColor={Colors[colorScheme ?? "light"].tint}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#FFFFFF"
          onSlidingStart={() => Vibration.vibrate(10)}
          onSlidingComplete={() => Vibration.vibrate(10)}
        />
      </ScrollView>
      <Modal onRequestClose={() => setShowColorModal(false)} visible={showColorModal} animationType="fade" transparent>
        <GestureHandlerRootView>
          <Pressable style={styles.modalContainer} onPress={() => setShowColorModal(false)}>
            <View style={styles.contentContainer}>
              <ColorPicker
                style={{ width: '100%' }}
                value={selectedColor}
                onComplete={({ hex }) => {
                  const [r, g, b] = colorKit.RGB(hex).array();
                  setLED("CUSTOM", [r, g, b]);
                  setSelectedColor(hex);
                }}
              >
                <Preview style={styles.componentMargin} />
                <Panel3 style={styles.componentMargin} />
                <BrightnessSlider style={styles.componentMargin} />
                <Swatches style={styles.componentMargin} />
                <Button title="Done" onPress={() => setShowColorModal(false)} />
              </ColorPicker>
            </View>
          </Pressable>
        </GestureHandlerRootView>
      </Modal>
    </>
  );
}
