import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import url from "../data/url";
import Header from "../components/layouts/Header"

const Profile = ({ navigation, route }) => {
  const { userId } = route.params;
  const [userData, setUserData] = useState({
    full_name: "",
    phone_number: "",
    address: "",
  });

  const menuItems = [
    { title: "Basic Details", icon: "person", link: "MyAccount" },
    { title: "About Us", icon: "info", link: "About" },
    { title: "Privacy Policy", icon: "privacy-tip", link: "Privacy" },
    { title: "Help", icon: "help-outline", link: "Help" },
    { title: "F&Q", icon: "question-answer", link: "Fq" },
  ];
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

  return (
    <>
      <Header userId={userId} navigation={navigation} />
      <View style={styles.container}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.titleText}>My Profile</Text>
        </View>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: "http://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
              }}
              style={styles.profileImage}
            />
            <Text style={styles.userName}>{userData.full_name}</Text>
            <Text style={styles.phoneNumber}>{userData.phone_number}</Text>
          </View>
        </View>

        <ScrollView style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.link, { userId: userId })}
            >
              <View style={styles.menuItemLeft}>
                <MaterialIcons name={item.icon} size={24} color="#585858" />
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#585858" />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileImageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: "transparent",
  },
  titleText: {
    marginVertical: 10,
    fontWeight: "900",
    fontSize: 16,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 0,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  phoneNumber: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  menuContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
  },
  logoutButton: {
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#388ce5",
    borderRadius: 5,
  },
  logoutText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Profile;
