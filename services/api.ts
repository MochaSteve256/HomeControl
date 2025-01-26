import { loadValue } from "@/services/storage";
import Toast from "react-native-simple-toast";

export async function wakePC(): Promise<void> {
  try {
    const API_BASE_URL = await loadValue("serverUrl");
    if (!API_BASE_URL) {
      throw new Error("API base URL not found in storage");
    }

    const API_TOKEN = await loadValue("token");
    if (!API_TOKEN) {
      throw new Error("API token not found in storage");
    }

    const response = await fetch(`${API_BASE_URL}/wake`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: API_TOKEN }),
    });

    if (!response.ok) {
      throw new Error(`Failed to wake PC: ${response.statusText}`);
    }
    //success toast
    Toast.show("PC Waked!", 2);
  } catch (error) {
    const errorMessage =
      (error as Error).message || "An unexpected error occurred";
    console.error("Error in wakePC:", errorMessage);
    Toast.show("Error: " + errorMessage, 2);
  }
}
