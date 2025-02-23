import React, { useState, useEffect } from "react";
import { Switch, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@/components/Text";
import View from "@/components/View";
import {
  Alarm,
  getAlarms,
  createAlarm,
  updateAlarmStatus,
  removeAlarm,
} from "@/services/api";

export default function Automations() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  // Fetch alarms from the API
  const fetchAlarms = async () => {
    const data = await getAlarms();
    setAlarms(data);
  };

  useEffect(() => {
    fetchAlarms();
  }, []);

  // Toggle alarm enable/disable
  const handleToggle = async (alarm: Alarm, newValue: boolean) => {
    await updateAlarmStatus(alarm.name, newValue);
    // Update local state after toggling
    setAlarms((prev) =>
      prev.map((a) =>
        a.name === alarm.name ? { ...a, enabled: newValue } : a
      )
    );
  };

  // Delete an alarm
  const handleDelete = (alarm: Alarm) => {
    // Optionally, confirm deletion
    Alert.alert(
      "Delete Alarm",
      `Are you sure you want to delete the alarm "${alarm.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await removeAlarm(alarm.name);
            setAlarms((prev) =>
              prev.filter((a) => a.name !== alarm.name)
            );
          },
        },
      ]
    );
  };

  // Create a new alarm with default values.
  // In a real app, you might show a form/modal to collect these details.
  const handleAdd = async () => {
    // For demonstration, create a dummy alarm.
    const newAlarm: Alarm = {
      name: `Alarm ${alarms.length + 1}`,
      action: "turn_on_light",
      repeat: "daily",
      time: "07:00",
      enabled: true,
    };

    await createAlarm(newAlarm);
    // Refresh the list after creating a new alarm.
    fetchAlarms();
  };

  return (
    <View style={{ flex: 1 }}>
      <Text className="text-xl">Automations</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {alarms.map((alarm) => (
          <View
            key={alarm.name}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 10,
              borderBottomWidth: 1,
              borderColor: "#ccc",
            }}
          >
            <Text>{`${alarm.name} - ${alarm.time}`}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Switch
                value={alarm.enabled}
                onValueChange={(value) => handleToggle(alarm, value)}
              />
              <TouchableOpacity
                onPress={() => handleDelete(alarm)}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={handleAdd}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#007AFF",
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          elevation: 5, // for Android shadow
          shadowColor: "#000", // for iOS shadow
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
        }}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
