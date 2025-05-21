import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../screens/Home";
import AuctionList from "../../screens/AuctionList";

const Stack = createNativeStackNavigator();

const AuctionScreen = ({ route }) => {
  const { userId } = route.params;
  return (
    <Stack.Navigator initialRouteName="AuctionList">
      <Stack.Screen
        name="AuctionList"
        options={{ headerShown: false }}
        component={AuctionList}
        initialParams={{ userId: userId }}
      />
    </Stack.Navigator>
  );
};

export default AuctionScreen;
