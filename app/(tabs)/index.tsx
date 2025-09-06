import {
  getVolume,
  setVolume,
  wakePC,
  lockScreen,
  shutdownPC,
  playPauseMusic,
  nextTrack,
  previousTrack
} from "@/services/api";

import ScrollView from "@/components/ScrollView";
import Text from "@/components/Text";
import View from "@/components/View";
import Button from "@/components/Button";
import { Colors } from "@/constants/Colors";

import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import Slider from '@react-native-community/slider';
import { useColorScheme } from "nativewind";
import {
  Vibration,
  Switch,
  SafeAreaView,
  Modal,
  View as NativeView,
  StyleSheet,
  Dimensions,
} from "react-native";



export default function PCControls() {

  const { colorScheme } = useColorScheme();

  const [pcVolume, setPcVolume] = useState<number>(0.3);
    const [isVolAdjusting, setIsvolAdjusting] = useState<boolean>(false);
  
    // Fetch volume every second, but don't override if user is adjusting
    useEffect(() => {
      const interval = setInterval(async () => {
        if (!isVolAdjusting) {
          const volume = await getVolume();
          if (volume !== null) {
            setPcVolume(volume);
          }
        }
      }, 1000);
      return () => clearInterval(interval);
    }, [isVolAdjusting]);
  
    const handleVolumeChange = async (value: number) => {
      setPcVolume(value);
      await setVolume(value);
    };
  
    return (
      <>
        <ScrollView>
        <Text className="text-2xl font-bold dark:text-white">PC Controls</Text>
          <Text className="text-xl font-bold dark:text-white">Power</Text>
          <SafeAreaView className="flex-row gap-2">
            <Button className="ml-0 w-32 h-24" title="START PC" onPress={wakePC} />
            <Button className="ml-0 w-32 h-24" title="LOCK SCREEN" onPress={lockScreen} />
            <Button className="ml-0 w-32 h-24" title="SHUTDOWN PC" onPress={shutdownPC} />
          </SafeAreaView>

          <Text className="text-xl font-bold dark:text-white">Music</Text>
          <SafeAreaView className="flex-row gap-2">
            <Button className="ml-0 w-32 h-24" onPress={previousTrack}>
              <Ionicons name="play-back" size={24} color="white" />
            </Button>
            <Button className="ml-0 w-32 h-24" onPress= {playPauseMusic}>
              <SafeAreaView className="flex-row items-center">
                <Ionicons name="play" size={24} color="white" />
                <Ionicons name="pause" size={24} color="white" />
              </SafeAreaView>
            </Button>
            <Button className="ml-0 w-32 h-24" onPress={nextTrack}>
              <Ionicons name="play-forward" size={24} color="white" />
            </Button>
          </SafeAreaView>
            <Text className="text-xl font-bold dark:text-white">Volume</Text>
            <Slider
              style={{ marginLeft: 0, marginTop: 10, ...(Dimensions.get('window').width > 768 ? { width: 456 } : { flex: 1}) }}
              thumbTintColor={Colors[colorScheme ?? "light"].tint}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor={Colors[colorScheme ?? "light"].text}
              maximumTrackTintColor={Colors[colorScheme ?? "light"].disabled}
              onSlidingStart={() => {
                setIsvolAdjusting(true);
                Vibration.vibrate(10);
              }}
              onSlidingComplete={(value) => {
                handleVolumeChange(value);
                Vibration.vibrate(10);
                setIsvolAdjusting(false);
              }}
              value={pcVolume}
            />
        </ScrollView>
      </>
    )
}