import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Text from "@/components/Text";
import View from "@/components/View";
import TextInput from "@/components/TextInput";

export default function OptionsScreen() {
  const [serverUrl, setServerUrl] = useState<string>("");

  // Load the server URL from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchServerUrl = async () => {
      try {
        const value = await AsyncStorage.getItem("serverUrl");
        if (value !== null) {
          setServerUrl(value); // Update state with stored value
        }
      } catch (e) {
        console.error("Error reading server URL:", e);
      }
    };

    fetchServerUrl();
  }, []);

  // Handle input changes and save to AsyncStorage
  const handleChange = async (value: string) => {
    setServerUrl(value); // Update state
    try {
      await AsyncStorage.setItem("serverUrl", value); // Save updated value to AsyncStorage
    } catch (e) {
      console.error("Error saving server URL:", e);
    }
  };

  return (
    <View>
      <Text>Server URL</Text>
      <TextInput
        placeholder="http://server:port"
        value={serverUrl}
        onChangeText={handleChange} // Call handleChange when text changes
      />
    </View>
  );
}
