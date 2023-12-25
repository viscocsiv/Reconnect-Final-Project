import { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export const LoginContext = createContext();
async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  return result;
}

export const LoginProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState("user");
  const [userId, setUserId] = useState(null);
  async function loginAction(data) {
    try {
      await SecureStore.setItemAsync("auth", data.access_token);
      await SecureStore.setItemAsync("userRole", data.role);
      await SecureStore.setItemAsync("userId", `${data.id}`);

      setIsLogin(true);
      setRole(data.role);
      setUserId(`${data.id}`);
    } catch (error) {
      console.log(error);
    }
  }

  async function LogoutActions(key) {
    try {
      await SecureStore.deleteItemAsync(key);
      setIsLogin(false);
      setRole("user");
      setUserId(null);
    } catch (error) {
      console.log(error);
    }
  }

  // secure storage
  useEffect(() => {
    getValueFor("auth")
      .then((data) => {
        // console.log(data);
        if (data) {
          setIsLogin(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <LoginContext.Provider
      value={{
        role,
        setRole,
        userId,
        setUserId,
        isLogin,
        setIsLogin,
        loginAction,
        LogoutActions,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
