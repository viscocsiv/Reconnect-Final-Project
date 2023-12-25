// DetailPostScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ImageSlider } from "../components/ImageSlider";
import { TopBar } from "../components/TopBar";
import * as SecureStore from "expo-secure-store";
import { publicRoute } from "../../url/route";
import axios from "axios";

export const Detail = ({ navigation, route }) => {
  const {
    images,
    comments,
    cafeName,
    cafePhoto,
    cafeOwnerId,
    eventName,
    eventTime,
    eventDescription,
    OccasionId,
  } = route.params;

  const joinRooms = async () => {
    // console.log(OccasionId, ">?>?>?>?");
    try {
      const token = await SecureStore.getItemAsync("auth");
      // console.log(token, "???????");
      const { data } = await axios({
        method: "get",
        url: publicRoute + "/room/occasion/" + OccasionId,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log(data, ">>>>>>>>");
      // // navigation.navigate("RoomChat", { roomId: data.id });
      navigation.navigate("RoomChat", {
        roomId: data.RoomId,
        eventId: data.OccasionId,
      });
    } catch (error) {
      console.log(error, ">>>>>>>>");
    }
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView style={styles.images}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <ImageSlider
          images={images}
          cafeName={cafeName}
          cafePhoto={cafePhoto}
          cafeOwnerId={cafeOwnerId}
          eventName={eventName}
          eventTime={eventTime}
          eventDescription={eventDescription}
        />
        <TouchableOpacity
          style={styles.joinButton}
          onPress={async () => {
            joinRooms();
          }}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
          <Text style={styles.joinButtonText}>Join Room Chat</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  images: {
    paddingTop: 20,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 15,
    padding: 10,
    backgroundColor: "#5E17EB",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  commentsContainer: {
    padding: 10,
  },
});
