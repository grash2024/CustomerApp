import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Payments from "../../screens/Payments";
import EnrollGroup from "../../screens/EnrollGroup";
import ViewMore from "../../screens/ViewMore";
import AuctionsRecord from "../../screens/AuctionsRecord";

const Stack = createNativeStackNavigator();

const PaymentScreen = ({ route }) => {
  const { userId } = route.params;
  return (
    <Stack.Navigator initialRouteName="Payments">
      <Stack.Screen
        name="Payments"
        initialParams={{ userId: userId }}
        options={{ headerShown: false }}
        component={Payments}
      />
      <Stack.Screen
        name="EnrollGroup"
        initialParams={{ userId: userId }}
        options={{ headerShown: false }}
        component={EnrollGroup}
      />
      <Stack.Screen
        name="AuctionsRecord"
        initialParams={{ userId: userId }}
        options={{ headerShown: false }}
        component={AuctionsRecord}
      />
      <Stack.Screen
        name="ViewMore"
        initialParams={{ userId: userId }}
        options={{ headerShown: false }}
        component={ViewMore}
      />
    </Stack.Navigator>
  );
};

export default PaymentScreen;
