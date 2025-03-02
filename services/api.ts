import { loadValue } from "@/services/storage";
import Toast from 'react-native-toast-message';

async function getAPIconfig(): Promise<{ API_BASE_URL: string; API_TOKEN: string } | null> {
  try {
    const API_BASE_URL = await loadValue("serverUrl");
    if (!API_BASE_URL) {
      console.error("API base URL not found in storage");
      return null;
    }

    const API_TOKEN = await loadValue("token");
    if (!API_TOKEN) {
      console.error("API token not found in storage");
      return null;
    }

    return {
      API_BASE_URL,
      API_TOKEN,
    };
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in getAPIconfig:", errorMessage);
    return null;
  }
}

export async function wakePC(): Promise<void> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/wake`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: config.API_TOKEN }),
    });

    if (!response.ok) {
      throw new Error(`Failed to wake PC: ${response.statusText}`);
    }

    // Success notification
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'PC is booting!'
    })
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in wakePC:", errorMessage);
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: errorMessage
    })
  }
}

export async function dismissAlarm(): Promise<void> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/dismiss`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to dismiss alarm: ${response.statusText}`);
    }

    // Success notification
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Alarm dismissed!'
    })    
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in dismissAlarm:", errorMessage);
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: errorMessage
    })
  }
}

export async function getPSUStatus(): Promise<boolean | null> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/psu`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get PSU status: ${response.statusText}`);
    }

    const data = await response.json();
    return data.is_on === 1; // Convert 1 to true and 0 to false
  } catch (error) {
    console.error("Error in getPSUStatus:", error);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: (error as Error).message || "An unexpected error occurred",
    });
    return null;
  }
}

export async function setPSU(status: boolean): Promise<boolean> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/psu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
      body: JSON.stringify({ is_on: status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to set PSU status: ${response.statusText}`);
    }

    Toast.show({
      type: "success",
      text1: "Success",
      text2: `PSU turned ${status ? "on" : "off"}!`,
    });

    return status;
  } catch (error) {
    console.error("Error in setPSU:", error);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: (error as Error).message || "An unexpected error occurred",
    });
    return !status; // Return the opposite to avoid false state updates
  }
}


export async function setLED(target: string, color?: [number, number, number]): Promise<void> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    // Build the request payload
    const payload: { target: string; color?: [number, number, number] } = { target };
    if (color) {
      payload.color = color;
    }

    const response = await fetch(`${config.API_BASE_URL}/led`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to set LED status: ${response.statusText}`);
    }

    // Success notification
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "LED set!",
    });
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in setLED:", errorMessage);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: errorMessage,
    });
  }
}

export async function getVolume(): Promise<number | null> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/volume`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get volume: ${response.statusText}`);
    }

    const data = await response.json();
    return data.volume; // Return the volume value
  } catch (error) {
    console.error("Error in getVolume:", error);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: (error as Error).message || "An unexpected error occurred",
    });
    return null;
  }
}

export async function setVolume(volume: number): Promise<number> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/volume`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
      body: JSON.stringify({ volume }),
    });

    if (!response.ok) {
      throw new Error(`Failed to set volume: ${response.statusText}`);
    }

    Toast.show({
      type: "success",
      text1: "Success",
      text2: `Volume set to ${Math.round(volume * 100)}!`,
    });

    return volume;
  } catch (error) {
    console.error("Error in setVolume:", error);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: (error as Error).message || "An unexpected error occurred",
    });
    return volume; // Return the original volume to avoid false state updates
  }
}

// Define the Alarm interface for type safety
export interface Alarm {
  name: string;
  action: string;
  repeat: string;
  time: string;
  enabled: boolean;
}


// Get all alarms
export async function getAlarms(): Promise<Alarm[]> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/alarm`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get alarms: ${response.statusText}`);
    }

    const data = await response.json();
    return data.schedules;
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in getAlarms:", errorMessage);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: errorMessage,
    });
    return [];
  }
}

// Create a new alarm
export async function createAlarm(alarm: Alarm): Promise<void> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/alarm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
      body: JSON.stringify(alarm),
    });

    if (!response.ok) {
      throw new Error(`Failed to create alarm: ${response.statusText}`);
    }

    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Alarm created!",
    });
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in createAlarm:", errorMessage);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: errorMessage,
    });
  }
}

// Remove an existing alarm by name
export async function removeAlarm(name: string): Promise<void> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/alarm`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error(`Failed to remove alarm: ${response.statusText}`);
    }

    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Alarm removed!",
    });
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in removeAlarm:", errorMessage);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: errorMessage,
    });
  }
}

// Update (enable/disable) an alarm by name
export async function updateAlarmStatus(name: string, enabled: boolean): Promise<void> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/alarm`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
      body: JSON.stringify({ name, enabled }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update alarm status: ${response.statusText}`);
    }

    Toast.show({
      type: "success",
      text1: "Success",
      text2: `Alarm ${enabled ? "enabled" : "disabled"}!`,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in updateAlarmStatus:", errorMessage);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: errorMessage,
    });
  }
}

export async function getAlarmActions(): Promise<string[]> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/alarm/actions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get alarm actions: ${response.statusText}`);
    }

    const data = await response.json();
    return data.actions;
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in getAlarmActions:", errorMessage);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: errorMessage,
    });
    return [];
  }
}