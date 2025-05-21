import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import ScreenNavigate from "./src/navigate/ScreenNavigate";

export default function App() {
  return (
    <>
      <ScreenNavigate />
    </>
  );
}
