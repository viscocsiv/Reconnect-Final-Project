import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Logo from "../../assets/Logo.png";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { publicRoute } from "../../url/route";
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "../../context/isLogin";
import Toast from "react-native-toast-message";

export const Login = ({ navigation, route }) => {
  const { setRole, setUserId, setIsLogin } = useContext(LoginContext);
  const { loginAction } = useContext(LoginContext);

  const [eyes, setEyes] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleLogin = async (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const submitLogin = async () => {
    try {
      if (!form.email) {
        Toast.show({
          type: "error",
          text1: "Login Error",
          text2: "Email is required",
        });
        return;
      }
      if (!form.password) {
        Toast.show({
          type: "error",
          text1: "Login Error",
          text2: "Password is required",
        });
        return;
      }
      const { data } = await axios({
        method: "post",
        url: publicRoute + "/login",
        data: form,
      }); // productions
      console.log(data, "LOGIN?????");
      await loginAction(data);
      setIsLogin(true);
      setRole(data.role);
      setUserId(`${data.id}`);
    } catch (error) {
      if (error.response) {
        Toast.show({
          type: "error",
          text1: "Login Error",
          text2: error.response.data.message,
        });
      } else {
        console.log(error, ">>>>>>>>");
      }
    }
  };

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
            Login to Your Account
          </Text>
          <TextInput
            label="Email"
            mode="outlined"
            placeholder="Input email"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ width: "60%" }}
            onChangeText={(value) => {
              handleLogin("email", value);
            }}
          />
          {eyes ? (
            <TextInput
              label="Password"
              mode="outlined"
              placeholder="Input password"
              style={{ width: "60%" }}
              right={
                <TextInput.Icon
                  onPress={() => {
                    setEyes(false);
                  }}
                  icon="eye"
                />
              }
              onChangeText={(value) => {
                handleLogin("password", value);
              }}
            />
          ) : (
            <TextInput
              label="Password"
              autoCapitalize="none"
              mode="outlined"
              placeholder="Input password"
              secureTextEntry
              style={{ width: "60%" }}
              right={
                <TextInput.Icon
                  onPress={() => {
                    setEyes(true);
                  }}
                  icon="eye-off"
                />
              }
              onChangeText={(value) => {
                handleLogin("password", value);
              }}
            />
          )}

          <Button
            mode="contained"
            style={{
              marginTop: 20,
              width: "60%",
              backgroundColor: "#5E17EB",
              borderRadius: 7,
            }}
            // onPress={() => navigation.navigate("Success")}
            onPress={async () => {
              submitLogin();
            }}
          >
            Log In
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
          <Text style={{ color: "grey" }}>{"Don't have an account?"}</Text>
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
});
