import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import axios from "axios";
import url from "../data/url";
import LottieView from "lottie-react-native";
import Header from "../components/layouts/Header";

const MyAccount = ({ route, navigation }) => {
  const { userId } = route.params;
  const [userData, setUserData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    address: "",
    pincode: "",
    adhaar_no: "",
    pan_no: "",
  });
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleInputChange = (field, value) => {
    setUserData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleUpdate = () => {
    axios
      .put(`${url}/user/update-user/${userId}`, userData)
      .then((response) => {
        setModalVisible(true); // Show the success modal
      })
      .catch((error) => {
        console.error(
          "Error updating user:",
          error.response ? error.response.data : error.message
        );
      });
  };

  return (
    <>
      <Header userId={userId} navigation={navigation} />
      <View style={styles.container}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.titleText}>Basic Details</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={userData.full_name}
              onChangeText={(text) => handleInputChange("full_name", text)}
            />
          </View>

          {/* Email and Phone Number in Single Row */}
          <View style={styles.inputGroupRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={userData.email}
                onChangeText={(text) => handleInputChange("email", text)}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={userData.phone_number}
                onChangeText={(text) => handleInputChange("phone_number", text)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={userData.address}
              onChangeText={(text) => handleInputChange("address", text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pincode</Text>
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              keyboardType="numeric"
              value={userData.pincode}
              onChangeText={(text) => handleInputChange("pincode", text)}
            />
          </View>

          {/* Aadhaar and PAN in Single Row */}
          <View style={styles.inputGroupRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Aadhaar No</Text>
              <TextInput
                style={styles.input}
                placeholder="Aadhaar No"
                keyboardType="numeric"
                value={userData.adhaar_no}
                onChangeText={(text) => handleInputChange("adhaar_no", text)}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>PAN No</Text>
              <TextInput
                style={styles.input}
                placeholder="PAN No"
                value={userData.pan_no}
                onChangeText={(text) => handleInputChange("pan_no", text)}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleUpdate}>
              <Text style={styles.logoutText}>Update</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Success Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeText}>X</Text>
              </TouchableOpacity>
              <LottieView
                source={require("../../assets/animations/success.json")} // Replace with your Lottie animation
                autoPlay
                loop={false}
                style={styles.lottieAnimation}
              />
              <Text style={styles.successText}>Updated Successfully</Text>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  dropdownContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: "transparent",
  },
  titleText: {
    marginVertical: 10,
    fontWeight: "900",
    fontSize: 18,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexGrow: 1,
    paddingBottom: 110,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputGroupRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 12,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  logoutButton: {
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#001d47",
    borderRadius: 15,
  },
  logoutText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 250,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center", // Ensure everything is centered
    height: "auto", // Automatically adjust height based on content
  },
  lottieAnimation: {
    width: 100,
    height: 100,
    marginBottom: 10, // Optional: Adjust margin to reduce gap
  },
  successText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    marginTop: 10, // Reduce this if the gap is too much
  },

  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#451d53",
  },
});

export default MyAccount;
