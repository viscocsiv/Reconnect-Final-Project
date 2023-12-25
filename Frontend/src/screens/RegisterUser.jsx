import { SafeAreaView, View, Image, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Logo from "../../assets/Logo.png";
import { useState } from "react";
import { publicRoute } from "../../url/route";
import axios from "axios";
import Toast from "react-native-toast-message";

export const RegisterUser = ({ navigation, route }) => {
  const [eyes, setEyes] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
  });
  const handleRegister = async (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const submitRegister = async () => {
    try {
      if (!form.email) {
        Toast.show({
          type: "error",
          text1: "Register Error",
          text2: "Email is required",
        });
        return;
      }
      if (!form.username) {
        Toast.show({
          type: "error",
          text1: "Register Error",
          text2: "Username is required",
        });
        return;
      }
      if (!form.password) {
        Toast.show({
          type: "error",
          text1: "Register Error",
          text2: "Password is required",
        });
        return;
      }
      // console.log(form);
      await axios({
        method: "post",
        url: publicRoute + "/register/user",
        data: form,
      }); // productions
      // console.log(data, "????");
      navigation.navigate("Login");
    } catch (error) {
      if (error.response) {
        Toast.show({
          type: "error",
          text1: "Register Error",
          text2: error.response.data.message,
        });
      } else {
        console.log(error, ">>>>>>>>");
      }
    }
  };

  // console.log(form);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerSecond}>
        <Text style={{ color: "grey" }}>English (United Kingdom)</Text>
        <Toast />
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
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Sign up as user to find cafe events nearby
          </Text>
          <TextInput
            label="Username"
            mode="outlined"
            placeholder="Input username"
            autoCapitalize="none"
            style={{ width: "60%" }}
            onChangeText={(value) => {
              handleRegister("username", value);
            }}
          />
          <TextInput
            label="Email"
            mode="outlined"
            placeholder="Input email"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ width: "60%" }}
            onChangeText={(value) => {
              handleRegister("email", value);
            }}
          />
          {eyes ? (
            <TextInput
              label="Password"
              mode="outlined"
              placeholder="Input password"
              style={{ width: "60%" }}
              onChangeText={(value) => {
                handleRegister("password", value);
              }}
              right={
                <TextInput.Icon
                  onPress={() => {
                    setEyes(false);
                  }}
                  icon="eye"
                />
              }
            />
          ) : (
            <TextInput
              label="Password"
              autoCapitalize="none"
              mode="outlined"
              placeholder="Input password"
              secureTextEntry
              style={{ width: "60%" }}
              onChangeText={(value) => {
                handleRegister("password", value);
              }}
              right={
                <TextInput.Icon
                  onPress={() => {
                    setEyes(true);
                  }}
                  icon="eye-off"
                />
              }
            />
          )}

          <Button
            mode="contained"
            style={{
              marginTop: 20,
              width: "60%",
              backgroundColor: "#6200ff",
              borderRadius: 7,
            }}
            onPress={async () => {
              submitRegister();
            }}
          >
            Register
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
          <Text style={{ color: "grey" }}>
            {"Want to change register as owner?"}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ fontWeight: "bold", color: "#45008b" }}>
              Sign Up
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
  map: {
    width: "60%",
    height: "100%",
  },
});
