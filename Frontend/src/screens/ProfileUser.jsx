import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { History } from "../components/History";
import { TopBar } from "../components/TopBar";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { publicRoute } from "../../url/route";
import { LoginContext } from "../../context/isLogin";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { ReadMoreComponent } from "../components/ReadMore";

const Tab = createMaterialTopTabNavigator();

export const ProfileUser = ({ route }) => {
  const { userId } = useContext(LoginContext);
  let userIdParams = undefined;
  // if (route.params) {
  //   userIdParams = route.params.UserId;
  // }

  const [profilePhoto, setProfilePhoto] = useState(
    "https://via.placeholder.com/150"
  );
  const [name, setName] = useState("Loading ...");
  const [desc, setDesc] = useState("");
  const [nameEdit, setNameEdit] = useState("Loading ...");
  const [descEdit, setDescEdit] = useState("");
  const [editing, setEditing] = useState(false);
  const [eventhistory, setEventHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchingUser();
    }, [])
  );

  const fetchingUser = async () => {
    setIsLoading(true);
    try {
      let id = userIdParams || userId;
      const token = await SecureStore.getItemAsync("auth");

      let userData = await axios({
        method: "get",
        url: publicRoute + `/user/${id}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      let history = userData.data.Rooms.map((el) => el.Occasion);
      setEventHistory(history);
      setName(userData.data.username);
      setDesc(userData.data.bio);
      setNameEdit(userData.data.username);
      setDescEdit(userData.data.bio);
      setProfilePhoto(userData.data.avatar);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image source={require("../../assets/Logo.png")} style={styles.logo} />
        <ActivityIndicator size="large" color="#5E17EB" />
      </View>
    );
  }

  const pickImage = async () => {
    if (userIdParams === undefined || userIdParams == userId) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        let localUri = result.assets[0].uri;
        let filename = localUri.split("/").pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        const formData = new FormData();
        formData.append("avatar", { uri: localUri, name: filename, type });
        const token = await SecureStore.getItemAsync("auth");
        await axios({
          method: "patch",
          url: publicRoute + `/user/avatar/${userId}`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        setProfilePhoto(result.assets[0].uri);
      }
    }
  };

  const handleEditProfile = async () => {
    if (editing) {
      const token = await SecureStore.getItemAsync("auth");
      if (name !== nameEdit) {
        await axios({
          method: "patch",
          url: publicRoute + `/user/username/${userId}`,
          data: { username: nameEdit },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setName(nameEdit);
      }
      if (desc !== descEdit) {
        await axios({
          method: "patch",
          url: publicRoute + `/user/bio/${userId}`,
          data: { bio: descEdit },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDesc(descEdit);
      }
    }
    setEditing(!editing);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
        </TouchableOpacity>
        {editing ? (
          <TextInput
            style={styles.input}
            value={nameEdit}
            onChangeText={setNameEdit}
          />
        ) : (
          <Text style={styles.name}>{name}</Text>
        )}
        {editing ? (
          <TextInput
            style={styles.input}
            value={descEdit}
            onChangeText={setDescEdit}
          />
        ) : (
          <ReadMoreComponent
            truncatedText={desc?desc.substring(0, 100):"Empty"}
            fullText={desc}
            textStyle={{ textAlign: "center" }}
          />
        )}
        {userIdParams === undefined || userIdParams == userId ? (
          <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
            <Text style={styles.buttonText}>
              {editing ? "Save Changes" : "Edit Profile"}
            </Text>
          </TouchableOpacity>
        ) : (
          ""
        )}
      </View>

      <Tab.Navigator>
        <Tab.Screen
          name="History"
          children={() => <History eventhistory={eventhistory} />}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  headerContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#ddd",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  desc: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#5E17EB",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 50,
    marginVertical: 10,
  },
  buttonMap: {
    backgroundColor: "#5E17EB",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 50,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
});
