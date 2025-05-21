import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../screens/Home";
import ReportList from "../../screens/ReportList";

const Stack = createNativeStackNavigator();

const ReportScreen = ({ route }) => {
  const { userId } = route.params;
  return (
    <Stack.Navigator initialRouteName="ReportList">
      <Stack.Screen
        name="ReportList"
        options={{ headerShown: false }}
        component={ReportList}
        initialParams={{ userId: userId }}
      />
    </Stack.Navigator>
  );
};

export default ReportScreen;
