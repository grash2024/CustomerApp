import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../screens/Home";
import AuctionScreen from "./AuctionScreen"
import ReportScreen from "./ReportScreen"

const Stack = createNativeStackNavigator();

const HomeScreen = ({ route }) => {
  const { userId } = route.params;
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        options={{ headerShown: false }}
        component={Home}
        initialParams={{ userId: userId }}
      />
      <Stack.Screen
        name="AuctionScreen"
        options={{ headerShown: false }}
        component={AuctionScreen}
        initialParams={{ userId: userId }}
      />
      <Stack.Screen
        name="ReportScreen"
        options={{ headerShown: false }}
        component={ReportScreen}
        initialParams={{ userId: userId }}
      />
    </Stack.Navigator>
  );
};

export default HomeScreen;
