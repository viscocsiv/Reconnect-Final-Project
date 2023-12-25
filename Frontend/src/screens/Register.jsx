import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import Logo from "../../assets/Logo.png";
import { Button, Text } from "react-native-paper";

export const Register = ({ navigation, route }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerSecond}>
        <Text style={{ color: "grey" }}>English (United Kingdom)</Text>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            marginBottom: 50,
            gap: 10,
          }}
        >
          <Image
            source={Logo}
            style={{
              height: 100,
              aspectRatio: 3 / 2,
              marginBottom: 10,
              resizeMode: "contain",
            }}
          />
          <Text style={{ fontSize: 15, fontWeight: "bold", marginBottom: 20 }}>
            Choose Your Role to Register New Account
          </Text>
          <Button
            onPress={() => navigation.navigate("RegisterOwner")}
            mode="contained"
            style={{
              width: "60%",
              backgroundColor: "#5E17EB",
              borderRadius: 7,
            }}
          >
            As Owner
          </Button>
          <Button
            onPress={() => navigation.navigate("RegisterUser")}
            mode="contained"
            style={{
              width: "60%",
              backgroundColor: "#5E17EB",
              borderRadius: 7,
            }}
          >
            As User
          </Button>
        </View>
        <View
          style={{
            borderTopWidth: 1,
            width: "100%",
            justifyContent: "center",
            flexDirection: "row",
            paddingTop: 20,
            borderColor: "grey",
            gap: 3,
          }}
        >
          <Text style={{ color: "grey" }}>{"Have an account?"}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ fontWeight: "bold", color: "#5E17EB" }}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    width: "100%",
  },
  containerSecond: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
});
