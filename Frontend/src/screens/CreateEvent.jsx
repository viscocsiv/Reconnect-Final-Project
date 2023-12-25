import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import { TopBar } from "../components/TopBar";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { publicRoute } from "../../url/route";
import axios from "axios";
import Toast from "react-native-toast-message";

export const CreateEvent = ({ navigation }) => {
  const [startMode, setStartMode] = useState("date");
  const [endMode, setEndMode] = useState("date");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(
    "https://via.placeholder.com/150"
  );
  const [startTime, setStartTime] = useState(new Date());
  const [imageData, setImageData] = useState({ uri: "", name: "", type: "" });
  const [endTime, setEndTime] = useState(new Date());
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const categories = [
    "Music",
    "Stand Up Comedy",
    "Performance",
    "Competitions",
  ];

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCategoryModalVisible(false);
  };
  const closeModal = () => setCategoryModalVisible(false);

  const showStartDatepicker = () => {
    setStartMode("date");
    setShowStartDatePicker(true);
  };

  const showStartTimepicker = () => {
    setStartMode("time");
    setShowStartDatePicker(true);
  };

  const showEndDatepicker = () => {
    setEndMode("date");
    setShowEndDatePicker(true);
  };

  const showEndTimepicker = () => {
    setEndMode("time");
    setShowEndDatePicker(true);
  };

  const handleChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startTime;
    setShowStartDatePicker(false);
    setStartTime(currentDate);
  };

  const handleChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endTime;
    setShowEndDatePicker(false);
    setEndTime(currentDate);
  };

  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      let localUri = result.assets[0].uri;
      let filename = localUri.split("/").pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      setSelectedImage(localUri);
      setImageData({ uri: localUri, name: filename, type });
    }
  };

  const handleFormSubmit = async () => {
    try {
      const token = await SecureStore.getItemAsync("auth");
      const formData = new FormData();
      formData.append("startTime", startTime.toISOString());
      formData.append("endTime", endTime.toISOString());
      formData.append("description", description);
      formData.append("eventName", eventName);
      formData.append("CategoryId", selectedCategory);
      formData.append("photo", imageData);

      const response = await axios({
        method: "post",
        url: publicRoute + `/occasion`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigation.navigate("Home");
      if (response.ok) {
        console.log("Form submitted successfully");
      } else {
        console.log(
          "Form submission failed. Server returned: ",
          response.status
        );
      }
    } catch (error) {
      console.log(
        "An error occured while submitting the form: ",
        error.response.data
      );
    }
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView>
        <View style={styles.containerInner}>
          <Text style={styles.title}>Create Event</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Start Time</Text>
            <View style={styles.pickerContainer}>
              <Button
                icon="calendar"
                textColor="#5E17EB"
                buttonColor="white"
                style={styles.pickerButton}
                onPress={showStartDatepicker}
              >
                Pick Event Start Date
              </Button>
              <Button
                icon="clock"
                textColor="#5E17EB"
                buttonColor="white"
                style={styles.pickerButton}
                onPress={showStartTimepicker}
              >
                Pick Event Start Time
              </Button>
              <Text>Selected: {startTime.toLocaleString()}</Text>
            </View>

            {showStartDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={startTime}
                mode={startMode}
                is24Hour={true}
                onChange={handleChangeStartDate}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Toast />
            <Text style={styles.label}>End Time</Text>
            <View style={styles.pickerContainer}>
              <Button
                icon="calendar"
                textColor="#5E17EB"
                buttonColor="white"
                style={styles.pickerButton}
                onPress={showEndDatepicker}
              >
                Pick Event End Date!
              </Button>
              <Button
                icon="clock"
                textColor="#5E17EB"
                buttonColor="white"
                style={styles.pickerButton}
                onPress={showEndTimepicker}
              >
                Pick Event End Time!
              </Button>
              <Text>Selected: {endTime.toLocaleString()}</Text>
              {}
            </View>

            {showEndDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={endTime}
                mode={endMode}
                is24Hour={true}
                onChange={handleChangeEndDate}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Event Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => {
                setEventName(value);
              }}
              placeholder="Enter Event Name"
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => {
                setDescription(value);
              }}
              placeholder="Enter Description"
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setCategoryModalVisible(true)}
            >
              <Text>{selectedCategory || "Select Category"}</Text>
            </TouchableOpacity>
          </View>

          {/* Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={categoryModalVisible}
            onRequestClose={closeModal}
          >
            {/* Modal background */}
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={closeModal} // Close the modal when the background is pressed
            >
              {/* Prevent modal close when the modal view is pressed */}
              <View
                style={styles.modalContainer}
                onStartShouldSetResponder={() => true}
              >
                <ScrollView>
                  {categories.map((category, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.modalItem}
                      onPress={() => handleSelectCategory(index + 1)}
                    >
                      <Text style={styles.modalText}>{category}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>

          <Image style={styles.imagePreview} source={{ uri: selectedImage }} />

          <TouchableOpacity
            style={styles.imagePicker}
            onPress={handleImageSelection}
          >
            <Text style={styles.imagePickerText}>Upload Image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleFormSubmit}
          >
            <Text style={styles.submitButtonText}>Create New Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerInner: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalText: {
    textAlign: "center",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  imagePickerText: {
    color: "#5E17EB",
  },
  imagePreview: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#5E17EB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  pickerContainer: {
    flex: 1,
    gap: 5,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});
