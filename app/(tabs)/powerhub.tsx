import { 
    dismissAlarm, 
    getPSUStatus, 
    setLED, 
    setPSU, 
    getDim,       // Added import for brightness
    setDim        // Added import for brightness
  } from "@/services/api";
  import Text from "@/components/Text";
  import ScrollView from "@/components/ScrollView";
  import View from "@/components/View";
  import Button from "@/components/Button";
  import {
    Vibration,
    Switch,
    SafeAreaView,
    Modal,
    View as NativeView,
    StyleSheet,
    Dimensions,
  } from "react-native";
  import { Slider } from '@miblanchard/react-native-slider';

  import ColorPicker, { Panel3, Swatches, Preview, BrightnessSlider, colorKit } from 'reanimated-color-picker';
  import { Picker } from "@react-native-picker/picker";
  import { Colors } from "@/constants/Colors";
  import { useState, useEffect, useCallback } from "react";
  import { useColorScheme } from "nativewind";
  import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
  import { useFocusEffect } from '@react-navigation/native';
  
  export default function ControlsScreen() {
    const [psuOn, setPsuOn] = useState<boolean>(false);
    const [showColorModal, setShowColorModal] = useState(false);
    const [selectedColor, setSelectedColor] = useState("#ffffff");
  
    // New state for LED Mode Picker
    const [showLedPicker, setShowLedPicker] = useState(false);
    const [selectedLedMode, setSelectedLedMode] = useState<string>("alarm");
  
    const { colorScheme } = useColorScheme();
    
    // Fetch PSU status when the component is focused
    useFocusEffect(
      useCallback(() => {
        async function fetchPSUStatus() {
          const status = await getPSUStatus();
          if (status !== null) {
            setPsuOn(status);
          }
        }
        fetchPSUStatus();
      }, [])
    );
    
    
  
    // Brightness state and fetching logic
    const [brightness, setBrightness] = useState(1);
    const [isBrightnessAdjusting, setIsBrightnessAdjusting] = useState<boolean>(false);
  
    // Fetch brightness every second, but don't override if the user is adjusting
    useEffect(() => {
      const interval = setInterval(async () => {
        if (!isBrightnessAdjusting) {
          const currentBrightness = await getDim();
          if (currentBrightness !== null) {
            setBrightness(currentBrightness);
          }
        }
      }, 1000);
      return () => clearInterval(interval);
    }, [isBrightnessAdjusting]);
  
    // Single brightness change function similar to the volume logic
    const handleBrightnessChange = async (value: number) => {
      setBrightness(value);
      await setDim(value);
    };
  
  
    const handlePSUchange = async () => {
      const updatedStatus = await setPSU(!psuOn);
      setPsuOn(updatedStatus);
    };
  
    const styles = StyleSheet.create({
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      contentContainer: {
        backgroundColor: "gray",
        borderRadius: 12,
        borderColor: Colors[colorScheme ?? "light"].text,
        borderWidth: 2,
        padding: 20,
        width: Dimensions.get('window').width > 768 ? '40%' : '80%', // Adjust width based on screen size
      },
      componentMargin: {
        marginVertical: 8,
        marginHorizontal: 2,
      },
      backdrop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    });
  
    async function customLED() {
      setShowColorModal(true);
    }
  
    // Instead of using Alert.alert with invalid syntax, we simply open the modal
    const moreLED = () => {
      setShowLedPicker(true);
    };
  
    return (
      <>
        <ScrollView>
          <Text className="text-2xl font-bold">Misc.</Text>
          <SafeAreaView className="flex-row space-x-4">
            <Button className="ml-0 w-32 h-24" onPress={handlePSUchange}>
              <SafeAreaView className="flex-row items-center">
                <Text className="px-5" style={{ color: "white" }}>PSU </Text>
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
            <Button className="mr-0 w-32 h-24" title="DISMISS ALARM" onPress={dismissAlarm} />
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
          
          <Text className="font-bold mt-2 mb-1">Brightness</Text>
          <Slider
            containerStyle={{ marginTop: 10, ...(Dimensions.get('window').width > 768 ? { width: 456 } : {}) }}
            thumbTintColor={Colors[colorScheme ?? "light"].tint}
            value={brightness}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={Colors[colorScheme ?? "light"].text}
            maximumTrackTintColor={Colors[colorScheme ?? "light"].disabled}
            onSlidingStart={() => {
              setIsBrightnessAdjusting(true);
              Vibration.vibrate(10);
            }}
            onSlidingComplete={ (valueArray) => {
              const value = Array.isArray(valueArray) ? valueArray[0] : valueArray;
              handleBrightnessChange(value);
              Vibration.vibrate(10);
              setIsBrightnessAdjusting(false);
            }}
          />
  
          {/*
          <Text className="font-bold mt-3 mb-1">Hue</Text>
          <Slider
            style={{ flex: 1, marginTop: 10 }}
            thumbTintColor={Colors[colorScheme ?? "light"].tint}
            //value={hue}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#FFFFFF"
            onSlidingStart={() => Vibration.vibrate(10)}
            onSlidingComplete={() => Vibration.vibrate(10)}
          />
          */}
          
          <View style={{ height: 10 }} />
  
        </ScrollView>
        
        {/* Modal for Custom LED Color */}
        <Modal onRequestClose={() => setShowColorModal(false)} visible={showColorModal} animationType="fade" transparent>
          <GestureHandlerRootView style={styles.modalContainer}>
            <Pressable style={styles.backdrop} onPress={() => setShowColorModal(false)} />
            <NativeView style={styles.contentContainer}>
              <ColorPicker
                style={{ width: "100%" }}
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
                <Button title="Close" onPress={() => {setShowColorModal(false) }} />
              </ColorPicker>
            </NativeView>
  
          </GestureHandlerRootView>
        </Modal>
        
        {/* Modal for LED Mode Picker */}
        <Modal
          visible={showLedPicker}
          animationType="fade"
          transparent
          onRequestClose={() => setShowLedPicker(false)}
        >
          <GestureHandlerRootView style={styles.modalContainer}>
            <Pressable style={styles.backdrop} onPress={() => setShowLedPicker(false)}/>
            <NativeView style={styles.contentContainer}>
                <Text className="text-xl font-bold">Select LED Mode</Text>
                <Picker
                  selectedValue={selectedLedMode}
                  style={{ height: 150, width: "100%" }}
                  onValueChange={async (itemValue) => {
                    setSelectedLedMode(itemValue);
                    await setLED(itemValue);
                    setShowLedPicker(false);
                  }}
                >
                  <Picker.Item label="Alarm" value="ALARM" color={Colors["light"].text} />
                  <Picker.Item label="Sunrise" value="SUNRISE" color={Colors["light"].text} />
                  <Picker.Item label="Sunset" value="SUNSET" color={Colors["light"].text} />
                </Picker>
                <Button title="Cancel " onPress={() => setShowLedPicker(false)} />
            </NativeView>
          </GestureHandlerRootView>
        </Modal>
      </>
    );
  }
  