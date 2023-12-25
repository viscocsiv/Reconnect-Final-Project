import { NavigationContainer } from "@react-navigation/native";
import { MainStack } from "./src/screens/MainStack";
import { LoginProvider } from "./context/isLogin";

export default function App() {
  return (
    <LoginProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </LoginProvider>
  );
}
