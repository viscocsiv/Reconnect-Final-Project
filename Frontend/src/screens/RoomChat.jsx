import React, { useState, useEffect, useRef, useId } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
import moment from "moment";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import io from "socket.io-client";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { publicRoute } from "../../url/route";

const socket = io(publicRoute);

export const RoomChat = ({ route, navigation }) => {
  const { roomId, eventId } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [participantsTyping, setParticipantsTyping] = useState([]);
  const [participants, setParticipants] = useState(["User Name"]);
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef();
  const typingAnimation = useRef(new Animated.Value(0)).current;
  const [user, setUser] = useState("");
  const [NameEvent, setNameEvent] = useState("");

  useEffect(() => {
    fetching(roomId);
    findUser();
    eventName();
    socket.emit("CLIENT_ROOMS", roomId);
  }, [roomId]);

  useEffect(() => {
    socket.on("SERVER_SEND_RESPONSE", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, [socket]);

  const fetching = async (roomId) => {
    try {
      const token = await SecureStore.getItemAsync("auth");
      const { data } = await axios({
        method: "get",
        url: publicRoute + "/room/list-message/" + roomId,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setMessages(data.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const findUser = async () => {
    const userId = await SecureStore.getItemAsync("userId");
    const token = await SecureStore.getItemAsync("auth");

    const { data } = await axios({
      method: "get",
      url: publicRoute + "/user/" + userId,
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    // console.log(data.username, "?>?>");
    setUser(data.username);
  };

  const eventName = async () => {
    try {
      const token = await SecureStore.getItemAsync("auth");

      const { data } = await axios({
        method: "get",
        url: publicRoute + "/occasion/" + eventId,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      // console.log(data.eventName, "?>?>?>?");
      setNameEvent(data.eventName);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (participantsTyping.length > 0) {
      setIsTyping(true);
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      setIsTyping(false);
      typingAnimation.setValue(0);
    }
  }, [participantsTyping, typingAnimation]);

  const getMessageTextColor = (sender) => {
    return sender === user ? "#fff" : "#333";
  };

  const handleSend = async () => {
    try {
      if (text.trim()) {
        const token = await SecureStore.getItemAsync("auth");
        // console.log(roomId);
        const { data } = await axios({
          method: "post",
          url: publicRoute + "/room/create-message/" + roomId,
          headers: {
            Authorization: "Bearer " + token,
          },
          data: {
            message: text,
          },
        }); // productions

        const send = {
          newMessage: data,
          roomId,
        };

        // const send = {
        //   newMessage: { id: Date.now(), text, sender: "me", time: new Date() },
        //   roomId,
        // };

        socket.emit("CLIENT_SEND_MSG", send);

        setMessages((prevMessages) => [...prevMessages, send.newMessage]);
        setText("");
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const startTyping = () => {
    if (!participantsTyping.includes(user)) {
      setParticipantsTyping([...participantsTyping, user]);
    }
  };

  const stopTyping = () => {
    if (participantsTyping.includes(user)) {
      setParticipantsTyping(
        participantsTyping.filter((participant) => participant !== user)
      );
    }
  };

  const receiveMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    stopTyping();
  };

  const timeAgo = (time) => moment(time).fromNow();
  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={30} color="#5E17EB" />
        </TouchableOpacity>
        <Text style={styles.userName}>{NameEvent}</Text>
      </View>

      <FlatList
        style={styles.messagesContainer}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
        renderItem={({ item }) => (
          <Animated.View
            style={[
              styles.messageBubble,
              item.User.username === user
                ? styles.myMessage
                : styles.otherMessage,
            ]}
          >
            <View style={styles.messageInfo}>
              <Image
                style={styles.profileIconSmall}
                source={{ uri: item.User.avatar }}
              />
              <Text style={styles.senderName}>{item.User.username}</Text>
            </View>
            <Text
              style={[
                styles.messageText,
                { color: getMessageTextColor(item.User.username) },
              ]}
            >
              {item.message}
            </Text>
            <Text style={styles.timeText}>{timeAgo(item.createdAt)}</Text>
          </Animated.View>
        )}
      />
      {isTyping && (
        <Animated.View
          style={{ ...styles.typingIndicator, opacity: typingAnimation }}
        >
          <Text style={styles.typingText}>Someone is typing...</Text>
        </Animated.View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          onFocus={startTyping}
          onBlur={stopTyping}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={handleSend}>
          <Ionicons name="send" size={24} color="#5E17EB" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#f7f7f7",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 50 : 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  backButton: {
    marginLeft: 10,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  profileIconSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  messagesContainer: {
    flex: 1,
  },
  messageBubble: {
    backgroundColor: "#e5e5ea",
    borderRadius: 20,
    padding: 10,
    marginVertical: 4,
    maxWidth: "70%",
    alignSelf: "flex-end",
    elevation: 1,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#5E17EB",
    marginRight: 10,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
    marginLeft: 10,
  },
  messageInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  senderName: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 5,
    color: "#afafaf",
  },
  messageText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  typingIndicator: {
    marginTop: 4,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  typingText: {
    color: "gray",
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  input: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
  },
});
