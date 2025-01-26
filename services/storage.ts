import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to load a value from AsyncStorage
export const loadValue = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.error(`Error loading ${key}:`, e);
    return null;
  }
};

// Function to save a value to AsyncStorage
export const saveValue = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
  }
};
