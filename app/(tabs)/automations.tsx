import React, { useState, useEffect } from "react";
import {
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Button,
  Platform,
  StyleSheet,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Text from "@/components/Text";
import View from "@/components/View";
import {
  Alarm,
  getAlarms,
  createAlarm,
  updateAlarmStatus,
  updateAlarm,
  removeAlarm,
  getAlarmActions,
} from "@/services/api";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";

export default function Automations() {
  const { colorScheme } = useColorScheme();

  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [actionsList, setActionsList] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  
  // Form states - shared between add and edit modals
  const [formName, setFormName] = useState("");
  const [formAction, setFormAction] = useState("psu_on");
  const [formTime, setFormTime] = useState("07:00");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"daily" | "custom">("daily");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Days of week for custom repeat
  const daysOfWeek = [
    { code: "mo", label: "Mon" },
    { code: "tu", label: "Tue" },
    { code: "we", label: "Wed" },
    { code: "th", label: "Thu" },
    { code: "fr", label: "Fri" },
    { code: "sa", label: "Sat" },
    { code: "su", label: "Sun" },
  ];

  // Fetch alarms and actions from the API
  const fetchAlarms = async () => {
    const data = await getAlarms();
    setAlarms(data);
  };

  const fetchActions = async () => {
    const actions = await getAlarmActions();
    setActionsList(actions);
  };

  useEffect(() => {
    fetchAlarms();
    fetchActions();
  }, []);

  // Reset form to default values
  const resetForm = () => {
    setFormName("");
    setFormAction("psu_on");
    setFormTime("07:00");
    setRepeatMode("daily");
    setSelectedDays([]);
  };

  // Populate form with alarm data for editing
  const populateFormForEdit = (alarm: Alarm) => {
    setFormName(alarm.name);
    setFormAction(alarm.action);
    setFormTime(alarm.time);
    
    if (alarm.repeat === "daily") {
      setRepeatMode("daily");
      setSelectedDays([]);
    } else {
      setRepeatMode("custom");
      // Parse the repeat string to extract selected days
      const days = [];
      for (const day of daysOfWeek) {
        if (alarm.repeat.includes(day.code)) {
          days.push(day.code);
        }
      }
      setSelectedDays(days);
    }
  };

  // Open add modal
  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  // Open edit modal
  const openEditModal = (alarm: Alarm) => {
    setEditingAlarm(alarm);
    populateFormForEdit(alarm);
    setEditModalVisible(true);
  };

  // Toggle alarm enable/disable
  const handleToggle = async (alarm: Alarm, newValue: boolean) => {
    if (!alarm.id) {
      console.error("Alarm ID is missing");
      return;
    }

    const success = await updateAlarmStatus(alarm.id, newValue);
    if (success) {
      setAlarms((prev) =>
        prev.map((a) =>
          a.id === alarm.id ? { ...a, enabled: newValue } : a
        )
      );
    }
  };

  // Delete an alarm
  const handleDelete = (alarm: Alarm) => {
    if (Platform.OS === "web") {
      const confirmed = confirm(`Are you sure you want to delete the alarm "${alarm.name}"?`);
      if (confirmed) {
        performDelete(alarm);
      }
    } else {
      Alert.alert(
        "Delete Alarm",
        `Are you sure you want to delete the alarm "${alarm.name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => performDelete(alarm),
          },
        ]
      );
    }
  };
  
  const performDelete = async (alarm: Alarm) => {
    if (!alarm.id) {
      console.error("Alarm ID is missing");
      return;
    }
  
    const success = await removeAlarm(alarm.id);
    if (success) {
      setAlarms((prev) => prev.filter((a) => a.id !== alarm.id));
    }
  };

  // Save new alarm from add modal
  const handleSave = async () => {
    const repeatValue = repeatMode === "daily" ? "daily" : selectedDays.join("");
    const newAlarm: Omit<Alarm, 'id'> = {
      name: formName || `Alarm ${alarms.length + 1}`,
      action: formAction,
      repeat: repeatValue,
      time: formTime,
      enabled: true,
    };
    
    const newId = await createAlarm(newAlarm);
    if (newId) {
      fetchAlarms(); // Refresh the list
    }
    
    resetForm();
    setModalVisible(false);
  };

  // Save edited alarm
  const handleEditSave = async () => {
    if (!editingAlarm?.id) {
      console.error("Editing alarm ID is missing");
      return;
    }

    const repeatValue = repeatMode === "daily" ? "daily" : selectedDays.join("");
    const updates: Partial<Omit<Alarm, 'id'>> = {
      name: formName,
      action: formAction,
      repeat: repeatValue,
      time: formTime,
      // Keep the current enabled state - don't change it during edit
    };
    
    const success = await updateAlarm(editingAlarm.id, updates);
    if (success) {
      fetchAlarms(); // Refresh the list
    }
    
    resetForm();
    setEditingAlarm(null);
    setEditModalVisible(false);
  };

  // Handle time picker change
  const onTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      setFormTime(`${hours}:${minutes}`);
    }
  };

  // Toggle day selection for custom repeat
  const toggleDay = (dayCode: string) => {
    if (selectedDays.includes(dayCode)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayCode));
    } else {
      setSelectedDays([...selectedDays, dayCode]);
    }
  };

  // Format repeat string for display
  const formatRepeat = (repeatString: string) => {
    if (repeatString === "daily") {
      return "Daily";
    }

    const dayLabels: Record<string, string> = {
      mo: "Mon",
      tu: "Tue",
      we: "Wed",
      th: "Thu",
      fr: "Fri",
      sa: "Sat",
      su: "Sun",
    };

    let selectedDayLabels = [];
    for (const [code, label] of Object.entries(dayLabels)) {
      if (repeatString.includes(code)) {
        selectedDayLabels.push(label);
      }
    }

    return selectedDayLabels.join(", ");
  };

  // Modal form component (shared between add and edit)
  const renderModalForm = (isEdit: boolean) => (
    <ScrollView>
      <Text className="text-xl mb-4">{isEdit ? "Edit Alarm" : "Add New Alarm"}</Text>
      
      <Text>Name:</Text>
      <TextInput
        value={formName}
        onChangeText={setFormName}
        placeholder="Enter alarm name"
        style={styles.input}
        placeholderTextColor={Colors[colorScheme ?? "light"].disabled}
      />
      
      <Text>Action:</Text>
      <Picker
        selectedValue={formAction}
        onValueChange={(itemValue) => setFormAction(itemValue)}
        style={styles.picker}
      >
        {actionsList.map((action) => (
          <Picker.Item
            key={action}
            label={action}
            value={action}
          />
        ))}
      </Picker>
      
      {Platform.OS === "web" ? (
        // Web-specific input for time
        <input
          type="time"
          value={formTime}
          onChange={(e) => setFormTime(e.target.value)}
        />
      ) : (
        <View>
          <Text>Time: {formTime}</Text>
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.timeButton}
          >
            <Text style={styles.buttonText}>Select Time</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
      
      <Text>Repeat:</Text>
      <View style={styles.repeatContainer}>
        <TouchableOpacity
          onPress={() => setRepeatMode("daily")}
          style={[
            styles.repeatButton,
            {
              backgroundColor:
                repeatMode === "daily"
                  ? Colors[colorScheme ?? "light"].tint
                  : "#ccc",
            },
          ]}
        >
          <Text style={styles.buttonText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRepeatMode("custom")}
          style={[
            styles.repeatButton,
            {
              backgroundColor:
                repeatMode === "custom"
                  ? Colors[colorScheme ?? "light"].tint
                  : "#ccc",
            },
          ]}
        >
          <Text style={styles.buttonText}>Custom</Text>
        </TouchableOpacity>
      </View>
      
      {repeatMode === "custom" && (
        <View style={styles.daysContainer}>
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day.code}
              onPress={() => toggleDay(day.code)}
              style={[
                styles.dayButton,
                {
                  backgroundColor: selectedDays.includes(day.code)
                    ? Colors[colorScheme ?? "light"].tint
                    : "#ccc",
                },
              ]}
            >
              <Text style={styles.dayButtonText}>{day.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <View style={styles.modalActions}>
        <Button 
          title="Cancel" 
          onPress={() => {
            if (isEdit) {
              setEditModalVisible(false);
              setEditingAlarm(null);
            } else {
              setModalVisible(false);
            }
            resetForm();
          }} 
        />
        <Button 
          title={isEdit ? "Update" : "Save"} 
          onPress={isEdit ? handleEditSave : handleSave} 
        />
      </View>
    </ScrollView>
  );

  const styles = StyleSheet.create({
    alarmRow: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: "#ccc",
      paddingVertical: 6,
      paddingHorizontal: 0,
    },
    nameText: {
      fontSize: 14,
    },
    timeText: {
      fontSize: 13,
    },
    repeatText: {
      fontSize: 11,
      color: "#fff",
    },
    actionContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 0,
      color: "#fff",
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      color: "#fff",
      borderRadius: 5,
      padding: 8,
      marginBottom: 10,
    },
    picker: {
      height: 50,
      marginBottom: 10,
      color: "#fff",
      backgroundColor: "black",
    },
    timeButton: {
      backgroundColor: "#007AFF",
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      alignItems: "center",
    },
    buttonText: {
      color: "white",
    },
    repeatContainer: {
      flexDirection: "row",
      marginBottom: 10,
      alignItems: "center",
    },
    repeatButton: {
      padding: 10,
      borderRadius: 5,
      marginRight: 10,
    },
    daysContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginBottom: 10,
    },
    dayButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      margin: 5,
    },
    dayButtonText: {
      color: "black",
      fontSize: 12,
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    fab: {
      position: "absolute",
      bottom: 40,
      left: 1,
      backgroundColor: Colors[colorScheme ?? "light"].tint,
      width: 60,
      height: 60,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      elevation: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
    },
    modalContainer: {
      flex: 1,
      minWidth: 400,
      maxWidth: 500,
      alignSelf: "center",
      backgroundColor: Colors[colorScheme ?? "light"].background,
    },
    contentContainer: {
      backgroundColor: Colors[colorScheme ?? "light"].background,
      borderRadius: 12,
      borderColor: Colors[colorScheme ?? "light"].text,
      borderWidth: 2,
      padding: 20,
      width: "100%",
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <Text className="text-xl">Automations</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {alarms.map((alarm) => (
          <View key={alarm.id || alarm.name} style={styles.alarmRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nameText}>{alarm.name}</Text>
            </View>
            <View style={{ width: 50, alignItems: "center" }}>
              <Text style={styles.timeText}>{alarm.time}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.repeatText}
              >
                {formatRepeat(alarm.repeat)}
              </Text>
            </View>
            <View style={styles.actionContainer}>
              <Switch
                value={alarm.enabled}
                onValueChange={(value) => handleToggle(alarm, value)}
                thumbColor={"white"}
                trackColor={{ false: "darkred", true: "green" }}
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              />
              <TouchableOpacity
                onPress={() => openEditModal(alarm)}
                style={{ marginLeft: 2 }}
              >
                <Ionicons name="pencil" size={18} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(alarm)}
                style={{ marginLeft: 2 }}
              >
                <Ionicons name="trash" size={18} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Modal */}
      <Modal
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
        visible={modalVisible}
        animationType="fade"
        transparent
      >
        <GestureHandlerRootView>
          <View style={styles.contentContainer}>
            {renderModalForm(false)}
          </View>
        </GestureHandlerRootView>
      </Modal>

      {/* Edit Modal */}
      <Modal
        onRequestClose={() => {
          setEditModalVisible(false);
          setEditingAlarm(null);
          resetForm();
        }}
        visible={editModalVisible}
        animationType="fade"
        transparent
      >
        <GestureHandlerRootView>
          <View style={styles.contentContainer}>
            {renderModalForm(true)}
          </View>
        </GestureHandlerRootView>
      </Modal>

      <TouchableOpacity
        onPress={openAddModal}
        style={styles.fab}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}