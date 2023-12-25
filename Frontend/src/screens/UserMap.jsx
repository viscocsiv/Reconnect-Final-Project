import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
} from "react-native";
import * as Location from "expo-location";
import React, { useState, useEffect, Fragment } from "react";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import userMarker from "../../assets/user-location-icon.png";
import { TopBar } from "../components/TopBar";
import MarkerComponent from "../components/MarkerComponent";
import OccasionListItem from "../components/OccassionMap";
import * as SecureStore from "expo-secure-store";
import { publicRoute } from "../../url/route";
import axios from "axios";
// let data = [
//   {
//     id: 1,
//     latitude: -6.2430588,
//     longitude: 106.805251,
//     price: 150,
//     title: "Cozy Studio in Downtown SF",
//     numberOfStars: 5,
//     rating: 4.8,
//     image: "https://placeholder.com/150",
//   },
//   {
//     id: 2,
//     latitude: -6.2630588,
//     longitude: 106.825251,
//     price: 200,
//     title: "Modern Apartment Near Golden Gate Park",
//     numberOfStars: 4,
//     rating: 4.5,
//     image: "https://placeholder.com/150",
//   },
// ];

export default function UserMap() {
  const [location, setLocation] = useState({
    coords: { latitude: -6.2530588, longitude: 106.8152 },
  });
  const [data, setData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedOcassion, setSelectedOcassion] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState(null);
  function handlePress(ocassion) {
    setSelectedOcassion(ocassion);
  }
  function handleClose() {
    setSelectedOcassion(null);
  }
  function handleDirection(ocassion) {
    setSelectedDirection(ocassion);
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access locatiob was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      await fetchingEvent(location);
      setLocation(location);
    })();
  }, []);
  const fetchingEvent = async (location) => {
    try {
      const token = await SecureStore.getItemAsync("auth");
      const { data } = await axios({
        method: "get",
        url:
          publicRoute +
          `/occasion?longitude=${location.coords.longitude}&latitude=${location.coords.latitude}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };
  let text = "Waiting...";
  if (errorMsg) {
    text(errorMsg);
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      <View
        style={{
          position: "absolute",
          top: "10%",
          left: 0,
          right: 0,
          zIndex: 9999,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            textAlign: "center",
            marginBottom: 10,
            width: "45%",
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            backgroundColor: "rgba(240, 240, 240, 0.7)",
          }}
        >
          Events Near You
        </Text>
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        showsBuildings={false}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={styles.map}
      >
        {location ? (
          <Fragment>
            <Circle
              center={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              radius={5000}
              strokeWidth={1}
              strokeColor="#1a66ff"
              fillColor="rgba(200,220,255,0.3)"
            />
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
            >
              <Image source={userMarker} style={{ width: 50, height: 50 }} />
            </Marker>
          </Fragment>
        ) : (
          ""
        )}
        {data.map((el) => {
          return (
            <MarkerComponent key={el.eventId} data={el} handlePress={handlePress} />
          );
        })}
        {selectedDirection ? (
          <MapViewDirections
            origin={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            destination={{
              latitude: selectedDirection.location.coordinates[1],
              longitude: selectedDirection.location.coordinates[0],
            }}
            apikey={process.env.EXPO_PUBLIC_GMAP_API_KEY}
            strokeWidth={4}
            strokeColor="red"
          />
        ) : (
          ""
        )}
      </MapView>
      {selectedOcassion && (
        <OccasionListItem
          data={selectedOcassion}
          handleDirection={handleDirection}
          handleClose={handleClose}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
