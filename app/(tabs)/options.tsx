import React, { useEffect, useState } from "react";
import Text from "@/components/Text";
import View from "@/components/View";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import { loadValue, saveValue } from "@/services/storage";
import { useColorScheme } from "nativewind";
import { Switch, Vibration, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OptionsScreen = () => {
  const [serverUrl, setServerUrl] = useState<string>("");
  const [apiToken, setApiToken] = useState<string>("");
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    const initializeValues = async () => {
      const storedServerUrl = await loadValue("serverUrl");
      const storedApiToken = await loadValue("token");

      if (storedServerUrl) setServerUrl(storedServerUrl);
      if (storedApiToken) setApiToken(storedApiToken);
    };

    initializeValues();
  }, []);

  const toggleColorScheme = async () => {
    const newScheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(newScheme);
    Vibration.vibrate(10);
    await AsyncStorage.setItem("colorScheme", newScheme); // Save user preference
  };

  return (
    <View>
      <Text className="text-xl ml-1 mb-1">Server URL</Text>
      <TextInput
        placeholder="http://server:port"
        value={serverUrl}
        onChangeText={(value) => {
          setServerUrl(value);
          saveValue("serverUrl", value);
        }}
      />
      <Text className="mt-4 text-xl mb-1 ml-1">API Token</Text>
      <TextInput
        placeholder="Enter your API token"
        value={apiToken}
        onChangeText={(value) => {
          setApiToken(value);
          saveValue("token", value);
        }}
      />
      <Text className="text-xl ml-1 mt-4">Appearance </Text>
      <Button
        className="ml-0 mr-0 py-1 px-1"
        onPress={toggleColorScheme}
      >
        <SafeAreaView className="flex-row items-center">
          <Text className="text-lg px-5 mr-0" style={{ color: "white" }}>Dark Mode </Text>
          <Switch
            className="mr-3"
            thumbColor={"white"}
            trackColor={{ false: "darkred", true: "lightgreen" }}
            value={colorScheme === "dark"}
            onValueChange={toggleColorScheme}
          />
        </SafeAreaView>
      </Button>
    </View>
  );
};

export default OptionsScreen;
