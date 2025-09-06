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

// ---
// PC functions
// ---

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
// Music Control Functions
export async function playPauseMusic(): Promise<void> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/music`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
      body: JSON.stringify({ action: "play_pause" }),
    });

    if (!response.ok) {
      throw new Error(`Failed to play/pause music: ${response.statusText}`);
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Music play/pause toggled!'
    });
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in playPauseMusic:", errorMessage);
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: errorMessage
    });
  }
}

export async function nextTrack(): Promise<void> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/music`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
      body: JSON.stringify({ action: "next" }),
    });

    if (!response.ok) {
      throw new Error(`Failed to skip to next track: ${response.statusText}`);
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Skipped to next track!'
    });
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in nextTrack:", errorMessage);
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: errorMessage
    });
  }
}

export async function previousTrack(): Promise<void> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/music`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
      body: JSON.stringify({ action: "previous" }),
    });

    if (!response.ok) {
      throw new Error(`Failed to go to previous track: ${response.statusText}`);
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Went to previous track!'
    });
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in previousTrack:", errorMessage);
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: errorMessage
    });
  }
}

// System Control Functions
export async function shutdownPC(): Promise<void> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/shutdown`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to shutdown PC: ${response.statusText}`);
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'PC is shutting down!'
    });
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in shutdownPC:", errorMessage);
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: errorMessage
    });
  }
}

export async function lockScreen(): Promise<void> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/lock`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to lock screen: ${response.statusText}`);
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Screen locked!'
    });
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in lockScreen:", errorMessage);
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: errorMessage
    });
  }
}


// --- 
// PowerHub functions
// ---

// Alarm operations

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


// Define the Alarm interface for type safety
export interface Alarm {
  id?: string; // Added ID field to match backend
  name: string;
  action: string;
  repeat: string;
  time: string;
  enabled: boolean;
}

// API response interface for getting all schedules
interface GetAlarmsResponse {
  schedules: Alarm[];
}

// API response interface for getting a single schedule
interface GetAlarmResponse {
  schedule: Alarm;
}

// API response interface for creating an alarm
interface CreateAlarmResponse {
  message: string;
  id: string;
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

    const data: GetAlarmsResponse = await response.json();
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

// Get a specific alarm by ID
export async function getAlarm(scheduleId: string): Promise<Alarm | null> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/alarm/${scheduleId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to get alarm: ${response.statusText}`);
    }

    const data: GetAlarmResponse = await response.json();
    return data.schedule;
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in getAlarm:", errorMessage);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: errorMessage,
    });
    return null;
  }
}

// Create a new alarm
export async function createAlarm(alarm: Omit<Alarm, 'id'>): Promise<string | null> {
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

    const data: CreateAlarmResponse = await response.json();
    
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Alarm created!",
    });

    return data.id;
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in createAlarm:", errorMessage);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: errorMessage,
    });
    return null;
  }
}

// Remove an existing alarm by ID
export async function removeAlarm(scheduleId: string): Promise<boolean> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/alarm/${scheduleId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Alarm not found");
      }
      throw new Error(`Failed to remove alarm: ${response.statusText}`);
    }

    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Alarm removed!",
    });

    return true;
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in removeAlarm:", errorMessage);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: errorMessage,
    });
    return false;
  }
}

// Update (enable/disable) an alarm by ID - simple toggle
export async function updateAlarmStatus(scheduleId: string, enabled: boolean): Promise<boolean> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/alarm/${scheduleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
      body: JSON.stringify({ enabled }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Alarm not found");
      }
      throw new Error(`Failed to update alarm status: ${response.statusText}`);
    }

    Toast.show({
      type: "success",
      text1: "Success",
      text2: `Alarm ${enabled ? "enabled" : "disabled"}!`,
    });

    return true;
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in updateAlarmStatus:", errorMessage);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: errorMessage,
    });
    return false;
  }
}

// Partially update an alarm (any fields)
export async function updateAlarm(
  scheduleId: string, 
  updates: Partial<Omit<Alarm, 'id'>>
): Promise<boolean> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/alarm/${scheduleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Alarm not found");
      }
      throw new Error(`Failed to update alarm: ${response.statusText}`);
    }

    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Alarm updated!",
    });

    return true;
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in updateAlarm:", errorMessage);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: errorMessage,
    });
    return false;
  }
}

// Replace an entire alarm (complete replacement)
export async function replaceAlarm(
  scheduleId: string, 
  alarm: Omit<Alarm, 'id'>
): Promise<boolean> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/alarm/${scheduleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
      body: JSON.stringify(alarm),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Alarm not found");
      }
      throw new Error(`Failed to replace alarm: ${response.statusText}`);
    }

    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Alarm replaced!",
    });

    return true;
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in replaceAlarm:", errorMessage);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: errorMessage,
    });
    return false;
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

// PSU operation and LED lighting

export async function getDim(): Promise<number | null> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/dim`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get dim: ${response.statusText}`);
    }

    const data = await response.json();
    return data.dim;
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in getDim:", errorMessage);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: errorMessage,
    });
    return null;
  }
}

export async function setDim(dim: number): Promise<void> {
  try {
    const config = await getAPIconfig();
    if (!config) {
      throw new Error("API configuration not found");
    }

    const response = await fetch(`${config.API_BASE_URL}/dim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: config.API_TOKEN,
      },
      body: JSON.stringify({ dim }),
    });

    if (!response.ok) {
      throw new Error(`Failed to set dim: ${response.statusText}`);
    }

    Toast.show({
      type: "success",
      text1: "Success",
      text2: `Dim set to ${dim}!`,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || "An unexpected error occurred";
    console.error("Error in setDim:", errorMessage);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: errorMessage,
    });
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
