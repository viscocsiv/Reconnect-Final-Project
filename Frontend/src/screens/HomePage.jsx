import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { TopBar } from "../components/TopBar";
import { Filter } from "../components/Filter";
import { ImageSlider } from "../components/ImageSlider";
import { Text } from "react-native-paper";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import { publicRoute } from "../../url/route";
import axios from "axios";

const bannerImage = require("../../assets/Banner.png");
const screenWidth = Dimensions.get("window").width;
const bannerHeight = screenWidth * (250 / 200);

export const HomePage = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  // mas ardi
  const [location, setLocation] = useState({
    coords: { latitude: -6.2530588, longitude: 106.8152 },
  });

  const [errorMsg, setErrorMsg] = useState(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access locatiob was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  // {{host}}/occasion?longitude=106.805234&latitude=-1.272244&CategoryId=2
  const [ctgy, setCtgy] = useState("");
  const [listEvent, setListEvent] = useState([]);

  useEffect(() => {
    fetchingEvent();
  }, [ctgy]);

  const fetchingEvent = async () => {
    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync("auth");
      // console.log(token);

      const { data } = await axios({
        method: "get",
        url:
          publicRoute +
          `/occasion?longitude=${location.coords.longitude}&latitude=${location.coords.latitude}&CategoryId=${ctgy}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      // console.log(data, ">>>>>>>>>>???");
      setListEvent(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const [selectedFilter, setSelectedFilter] = useState("");

  const handleSelectFilter = (filter) => {
    setSelectedFilter(filter);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // if (isLoading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <Image source={require("../../assets/Logo.png")} style={styles.logo} />
  //       <ActivityIndicator size="large" color="#5E17EB" />
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>{getGreeting()}, User!</Text>
      </View>
      <Filter onSelectFilter={handleSelectFilter} setCtgy={setCtgy} />
      <ScrollView>
        <View style={styles.bannerShadow}>
          <Image
            source={bannerImage}
            style={[styles.bannerImage, { height: bannerHeight }]}
          />
        </View>
        <Text style={styles.eventsNearby}>Events Nearby,</Text>

        {listEvent &&
          listEvent.map((el) => {
            const dateFormatStart = new Date(el.startTime).toLocaleString();
            const dateFormatEnd = new Date(el.endTime).toLocaleString();
            return (
              <ImageSlider
                key={el.eventId}
                images={el.eventPhoto}
                cafeName={el.eventName}
                cafePhoto={el.photo}
                eventName={el.name}
                cafeOwnerId={el.UserId}
                eventTime={`${dateFormatStart} ${dateFormatEnd}`}
                eventDescription={el.description}
                onPressImage={() =>
                  navigation.navigate("Detail", {
                    images: el.eventPhoto,
                    cafeName: el.eventName,
                    cafePhoto: el.photo,
                    cafeOwnerId: el.UserId,
                    eventName: el.name,
                    eventTime: `${dateFormatStart} ${dateFormatEnd}`,
                    eventDescription: el.description,
                    OccasionId: el.eventId,
                  })
                }
              />
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  content: {
    padding: 10,
  },
  selectedFilterText: {
    fontSize: 16,
    marginVertical: 10,
  },
  scrollViewStyle: {
    flex: 1,
  },
  greetingContainer: {
    alignItems: "center",
    padding: 10,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  eventsNearby: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  bannerShadow: {
    margin: 10,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  bannerImage: {
    width: screenWidth - 20,
    resizeMode: "cover",
  },
});
