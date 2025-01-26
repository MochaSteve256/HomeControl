import React, { useEffect, useState } from "react";
import Text from "@/components/Text";
import View from "@/components/View";
import TextInput from "@/components/TextInput";
import { loadValue, saveValue } from "@/services/storage";

const OptionsScreen = () => {
  const [serverUrl, setServerUrl] = useState<string>("");
  const [apiToken, setApiToken] = useState<string>("");

  useEffect(() => {
    const initializeValues = async () => {
      const storedServerUrl = await loadValue("serverUrl");
      const storedApiToken = await loadValue("token");

      if (storedServerUrl) setServerUrl(storedServerUrl);
      if (storedApiToken) setApiToken(storedApiToken);
    };

    initializeValues();
  }, []);

  return (
    <View>
      <Text>Server URL</Text>
      <TextInput
        placeholder="http://server:port"
        value={serverUrl}
        onChangeText={(value) => {
          setServerUrl(value);
          saveValue("serverUrl", value);
        }}
      />

      <Text className="mt-4">API Token</Text>
      <TextInput
        placeholder="Enter your API token"
        value={apiToken}
        onChangeText={(value) => {
          setApiToken(value);
          saveValue("token", value);
        }}
      />
    </View>
  );
};

export default OptionsScreen;
