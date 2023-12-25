import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "./Login";
import { Register } from "./Register";
import { RegisterOwner } from "./RegisterOwner";
import { RegisterUser } from "./RegisterUser";
import { TabBottom } from "../components/TabBottom";
import { Detail } from "./Detail";
import { RoomChat } from "./RoomChat";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../context/isLogin";
import * as SecureStore from "expo-secure-store";
import { TabBottomUser } from "../components/TabBottomUser";

const Stack = createNativeStackNavigator();

export const MainStack = ({ navigation, route }) => {
  const { isLogin } = useContext(LoginContext);
  const { role } = useContext(LoginContext);
  console.log(role, "?????>>");
  return (
    <Stack.Navigator>
      {isLogin ? (
        <>
          {role === "user" ? (
            <Stack.Screen
              name="SuccessUser"
              options={{ headerShown: false }}
              component={TabBottomUser}
            />
          ) : (
            <Stack.Screen
              name="Success"
              options={{ headerShown: false }}
              component={TabBottom}
            />
          )}

          <Stack.Screen
            name="Detail"
            component={Detail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RoomChat"
            component={RoomChat}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
            component={Login}
          />
          <Stack.Screen
            name="Register"
            options={{ headerShown: false }}
            component={Register}
          />
          <Stack.Screen
            name="RegisterOwner"
            options={{ headerShown: false }}
            component={RegisterOwner}
          />
          <Stack.Screen
            name="RegisterUser"
            options={{ headerShown: false }}
            component={RegisterUser}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
