import React, { useRef, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { MaterialIcons } from "@expo/vector-icons";
import url from "../data/url";
import axios from "axios";
import Header from "../components/layouts/Header";

const images = [
  "https://static.vecteezy.com/system/resources/previews/000/179/076/original/vector-biggest-sale-offers-and-discount-banner-template-for-promotion.jpg",
  "http://moussyusa.com/wp-content/uploads/2020/04/Promotional-Banner-Design-Template.jpg",
  "https://img.freepik.com/premium-vector/promotional-banners-discounts-cash-back_472514-143.jpg",
  "https://static.vecteezy.com/system/resources/previews/000/178/857/original/vector-best-sale-banner-and-sale-voucher-design-for-brand-promotion.jpg",
];

const boxes = [
  {
    image: "https://cdn-icons-png.freepik.com/256/15377/15377583.png",
    title: "My Groups",
    subtitle: "Child's future plan",
    redirect: "PaymentScreen"
  },
  {
    image:
      "https://cdn-icons-png.flaticon.com/512/2400/2400225.png",
    title: "My Payments",
    subtitle: "Save more and use",
    redirect: "PaymentScreen"
  },
  {
    image:
      "https://cdn-icons-png.flaticon.com/512/8019/8019132.png",
    title: "New Groups",
    subtitle: "",
    redirect: "EnrollScreen"
  },
  {
    image:
      "https://www.pngmart.com/files/3/Stock-Market-Graph-Up-PNG-Photos.png",
    title: "Reports",
    subtitle: "Get detailed insights",
    redirect: "PaymentScreen"
  },
];

const iconData = [
  { name: "Groups", icon: "group-work", redirect: "EnrollScreen" },
  { name: "My Enrolls", icon: "group", redirect: "PaymentScreen" },
  { name: "Auctions", icon: "swap-calls", redirect: "AuctionScreen" },
  { name: "My Payments", icon: "payments", redirect: "PaymentScreen" },
  { name: "Reports", icon: "bar-chart", redirect: "ReportScreen" },
];

const handleContactUs = () => {
  const phoneNumber = "8431065562";
  Linking.canOpenURL(`tel:${phoneNumber}`)
    .then((supported) => {
      if (supported) {
        Linking.openURL(`tel:${phoneNumber}`)
          .catch((error) => {
            console.error("Error opening phone dialer:", error);
            Alert.alert("Error opening phone dialer");
          });
      } else {
        console.error("Phone call is not supported on this device.");
        Alert.alert("Phone call not supported");
      }
    })
    .catch((error) => {
      console.error("Error checking phone dialer availability:", error);
      Alert.alert("Error checking phone dialer availability");
    });
};

const Home = ({ route, navigation }) => {
  const { userId } = route.params;
  const scrollViewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;

  const [userData, setUserData] = useState({
    full_name: "",
    phone_number: "",
    address: "",
  });

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      scrollViewRef.current?.scrollTo({
        x: screenWidth * (activeIndex + 1),
        animated: true,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const scrollToNextImage = () => {
    if (scrollViewRef.current) {
      let nextIndex = activeIndex + 1;
      if (nextIndex === images.length) {
        setActiveIndex(0);
        scrollViewRef.current.scrollTo({ x: 0, animated: false });
      } else {
        scrollViewRef.current.scrollTo({
          x: screenWidth * nextIndex,
          animated: true,
        });
      }
    }
  };

  return (
    <>
      <Header userId={userId} navigation={navigation} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 85 }}
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={styles.headerTextContainer}>
          <Text style={[styles.headerText, { marginBottom: 5 }]}>
            Hey {userData.full_name}!
          </Text>
          <Text style={styles.headerText}>
            Welcome to MyChits
          </Text>
        </View>
        <View style={styles.squareBannerContainer}>
          <Image
            source={{
              uri: "https://www.softwares.mypay.zone/images/chitfund.jpg",
            }}
            style={styles.squareBannerImage}
          />
        </View> */}
        {/* <View style={{ marginHorizontal: 20, paddingTop: 30 }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, color: "#000" }}>
            Trending
          </Text>
        </View> */}
        {/* <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            const scrollPosition = event.nativeEvent.contentOffset.x;
            const newIndex = Math.floor(scrollPosition / screenWidth);
            setActiveIndex(newIndex % images.length);
          }}
          scrollEventThrottle={16}
          style={{ marginTop: 10 }}
        >
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.bannerImage}
            />
          ))}
        </ScrollView> */}
        <View style={{ marginHorizontal: 20, paddingTop: 30 }}>
          {/* <Text style={{ fontSize: 12 }}>Hello,</Text> */}
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>Hello {userData.full_name}!</Text>
        </View>
        <View style={styles.boxContainer}>
          {boxes.map((box, index) => (
            <TouchableOpacity key={index} style={styles.box} onPress={() => navigation.navigate(box.redirect)}>
              <Image source={{ uri: box.image }} style={styles.boxImage} />
              <Text style={styles.boxTitle}>{box.title}</Text>
              {/* <Text style={styles.boxSubtitle}>{box.subtitle}</Text> */}
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ marginHorizontal: 20, paddingTop: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Services</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.scrollViewContainer, { justifyContent: "center" }]}
        >
          {iconData.map((item, index) => (
            <TouchableOpacity key={index} style={styles.iconContainer} onPress={() => navigation.navigate(item.redirect)}>
              <View style={styles.circle}>
                <MaterialIcons name={item.icon} size={24} color="#fff" />
              </View>
              <Text style={styles.iconName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* <View style={styles.viewAllContainer}>
          <View style={styles.line} />
          <Text style={styles.viewAllButton}>
            View all features{" "}
            <AntDesign name="arrowright" size={10} color="black" />
          </Text>
          <View style={styles.line} />
        </View> */}
        <View style={{ marginHorizontal: 20, paddingTop: 30 }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, color: "#000" }}>
            Special
          </Text>
        </View>
        <View style={styles.rectangleBannerContainer}>
          <Image
            source={{
              uri: "https://content.jdmagicbox.com/comp/def_content/chit-fund-companies/658946-money-savings-chit-fund-companies-8-y6uyw.jpg",
            }}
            style={styles.rectangleBannerImage}
          />
        </View>
        <View style={{ marginHorizontal: 20, paddingTop: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, color: "#000" }}>
            Support
          </Text>
        </View>
        <View style={styles.stripBanner}>
          <View style={styles.leftContainer}>
            <Feather name="help-circle" style={styles.helpIcon} size={20} />
            <Text style={styles.helpText}>Need Help?</Text>
          </View>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactUs}>
            <Text style={styles.contactButtonText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerContainer}>
          {/* <Text style={styles.securityText}>Your money is 100% secured!</Text> */}
          <Text style={styles.companyName}>MyChits</Text>
          <Text style={styles.address}>
            11/36, Kathriguppe Main Road, 2nd Cross Banshankari, Bangalore,
            Karnataka
          </Text>
          <Text style={styles.mobileNumber}>+91 (944) 982-2589</Text>
        </View>
      </ScrollView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerTextContainer: {
    backgroundColor: "#b3d8ff",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  headerText: {
    fontWeight: "900",
    color: "#5f5f5f",
  },
  squareBannerContainer: {
    backgroundColor: "#b3d8ff",
    padding: 5,
    alignItems: "center",
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  squareBannerImage: {
    width: Dimensions.get("window").width - 120,
    height: Dimensions.get("window").width - 120,
    resizeMode: "cover",
    borderRadius: 15,
    marginBottom: 10,
  },
  boxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  box: {
    width: (Dimensions.get("window").width - 60) / 2,
    backgroundColor: "#001d47",
    borderRadius: 10,
    alignItems: "start",
    padding: 10,
    marginBottom: 20,
  },
  boxImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginBottom: 10,
  },
  boxTitle: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 14,
    textAlign: "left",
  },
  boxSubtitle: {
    color: "#ccc",
    fontSize: 12,
    textAlign: "left",
  },
  bannerImage: {
    width: Dimensions.get("window").width,
    height: 150,
    resizeMode: "cover",
    borderRadius: 35,
  },
  viewAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  viewAllButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#b3d8ff",
    borderRadius: 25,
    fontSize: 12,
    fontWeight: "900",
    color: "#001d47",
    marginHorizontal: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#b3d8ff",
  },
  rectangleBannerContainer: {
    padding: 10,
    alignItems: "center",
  },
  rectangleBannerImage: {
    width: Dimensions.get("window").width - 20,
    height: Dimensions.get("window").width - 120,
    resizeMode: "cover",
    borderRadius: 15,
    marginBottom: 10,
  },
  stripBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f3f5f8",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    marginHorizontal: 20,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  helpIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  helpText: {
    fontSize: 14,
    color: "#000",
  },
  contactButton: {
    backgroundColor: "#001d47",
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  contactButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footerContainer: {
    padding: 20,
    backgroundColor: "#b3d8ff",
    borderTopWidth: 1,
    borderTopColor: "#fff",
    alignItems: "flex-start",
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 20,
  },
  securityText: {
    fontSize: 18,
    color: "#000",
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "900",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
    textAlign: "center",
  },
  address: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: "left",
    color: "#000",
  },
  mobileNumber: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
  },
  scrollViewContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  iconContainer: {
    alignItems: "center",
    marginHorizontal: 15,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 13,
    backgroundColor: "#001d47",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  iconName: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
});
