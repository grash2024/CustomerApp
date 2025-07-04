import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Enrollment from "../../screens/Enrollment";
import EnrollForm from "../../screens/EnrollForm";
import EnrollConfirm from "../../screens/EnrollConfirm";

const Stack = createNativeStackNavigator();

const EnrollScreen = ({ route }) => {
  const { userId } = route.params;
  return (
    <Stack.Navigator initialRouteName="Enroll">
      <Stack.Screen
        name="Enroll"
        initialParams={{ userId: userId }}
        options={{ headerShown: false }}
        component={Enrollment}
      />
      <Stack.Screen
        name="EnrollForm"
        initialParams={{ userId: userId }}
        options={{ headerShown: false }}
        component={EnrollForm}
      />
      <Stack.Screen
        name="EnrollConfirm"
        initialParams={{ userId: userId }}
        options={{ headerShown: false }}
        component={EnrollConfirm}
      />
    </Stack.Navigator>
  );
};

export default EnrollScreen;
