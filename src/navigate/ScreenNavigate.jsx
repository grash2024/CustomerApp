import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Entypo } from "react-native-vector-icons";
import { Image, StatusBar, StyleSheet } from "react-native";
import Login from "../screens/Login";
import Register from "../screens/Register";
import HomeScreen from "./Screens/HomeScreen";
import EnrollScreen from "./Screens/EnrollScreen";
import PaymentScreen from "./Screens/PaymentScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import Header from "../components/layouts/Header";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ScreenNavigate = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#b3d8ff" />
      <Stack.Navigator initialRouteName="Login">
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
          name="BottomTab"
          options={{ headerShown: false }}
          component={TabNavigate}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ScreenNavigate;

const TabNavigate = ({ route, navigation }) => {
  const { userId } = route.params;
  return (
    <>
      <Tab.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          tabBarStyle: {
            position: "absolute",
            bottom: 0,
            left: 20,
            right: 20,
            elevation: 0,
            backgroundColor: "#b3d8ff",
            borderRadius: 0,
            height: 50,
            ...styles.shadow,
          },
          tabBarLabelStyle: { display: "none" },
        }}
      >
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={focused ? "#001d47" : "#727272"}
              />
            ),
          }}
          initialParams={{ userId: userId }}
        />
        <Tab.Screen
          name="EnrollScreen"
          initialParams={{ userId: userId }}
          component={EnrollScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Entypo
                name={focused ? "add-to-list" : "add-to-list"}
                size={24}
                color={focused ? "#001d47" : "#727272"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="PaymentScreen"
          initialParams={{ userId: userId }}
          component={PaymentScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "card" : "card-outline"}
                size={24}
                color={focused ? "#001d47" : "#727272"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="ProfileScreen"
          initialParams={{ userId: userId }}
          component={ProfileScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={focused ? "#001d47" : "#727272"}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
