import React from "react";
import { View, Text } from "react-native";
import { Marker } from "react-native-maps";

export default function MarkerComponent({ data, handlePress }) {
  return (
    <Marker
      key={data.id}
      onPress={() => handlePress(data)}
      coordinate={{
        latitude: data.location.coordinates[1],
        longitude: data.location.coordinates[0],
      }}
      title={data.eventName}
      description={data.name}
    ></Marker>
  );
}
