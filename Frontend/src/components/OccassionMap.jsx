import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
export default function OccasionListItem({
  data,
  handleDirection,
  handleClose,
}) {
  const navigation = useNavigation();
  const dateFormatStart = new Date(data.startTime).toLocaleString();
  const dateFormatEnd = new Date(data.endTime).toLocaleString();
  return (
    <View style={styles.card}>
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <Image source={{ uri: data.eventPhoto }} style={styles.image} />
      </View>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View style={{ marginLeft: 5, marginTop: 5 }}>
          <TouchableOpacity
            onPress={handleClose}
            style={{ position: "absolute", right: 0, top: -20, padding: 5 }}
          >
            <Text style={{ color: "red", fontWeight: "bold", fontSize: 16 }}>
              X
            </Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: "bold" }}>{data.eventName}</Text>
          <Text style={{ color: "gray" }}>By : {data.name}</Text>
          <Text style={{ color: "gray" }}>Start Time :</Text>
          <Text style={{ color: "gray" }}>{dateFormatStart}</Text>
          <Text style={{ color: "gray" }}>End Time :</Text>
          <Text style={{ color: "gray" }}>{dateFormatEnd}</Text>
          <Text style={{ color: "gray" }}>Category : {data.categoryName}</Text>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <TouchableOpacity
              onPress={() => handleDirection(data)}
              style={styles.touchableDirection}
            >
              <Text style={styles.textDirection}>Direction</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Detail", {
                  images: data.eventPhoto,
                  cafeName: data.eventName,
                  cafePhoto: data.photo,
                  eventName: data.name,
                  eventTime: `${dateFormatStart} ${dateFormatEnd}`,
                  eventDescription: data.description,
                  OccasionId: data.eventId,
                })
              }
              style={styles.touchableDetail}
            >
              <Text style={styles.textDirection}>Show Detail</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 40,
    padding: 10,
    right: 10,
    left: 10,
    flexDirection: "row",
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    width: 150,
    aspectRatio: 1,
    borderRadius: 5,
    marginVertical: "auto",
  },
  textDirection: {
    color: "white",
    fontWeight: "bold",
  },
  touchableDirection: {
    borderRadius: 5,
    padding: 5,
    backgroundColor: "#5E17EB",
  },
  touchableDetail: {
    marginLeft: 5,
    borderRadius: 5,
    padding: 5,
    backgroundColor: "#000000",
  },
});
