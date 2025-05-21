import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import url from "../../data/url";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

const Header = ({ userId, navigation }) => {
  const [userData, setUserData] = useState({
    full_name: "",
    phone_number: "",
    address: "",
  });

  const route = useRoute();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${url}/user/get-user-by-id/${userId}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const showBackButton = route.name !== "Home";
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.leftContainer} onPress={() =>
        navigation.navigate("BottomTab", {
          screen: "ProfileScreen",
        }, { userId: userId })
      }>
        {showBackButton && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
        )}
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: "http://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
            }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileName}>{userData.full_name}</Text>
            <Text style={styles.customerId}>{userData.phone_number}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <AntDesign name="infocirlceo" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#b3d8ff",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  profileName: {
    color: "#451d53",
    fontSize: 18,
    fontWeight: "800",
  },
  customerId: {
    color: "#451d53",
    fontSize: 10,
  },
});

export default Header;
