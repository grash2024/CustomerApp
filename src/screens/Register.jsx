import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import url from "../data/url";

export default function Register() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState("success");

  const handleRegister = async () => {
    try {
      const response = await fetch(`${url}/user/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: form.name,
          phone_number: form.mobile,
          password: form.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus("success");
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate("BottomTab", { userId: data.userId });
        }, 1500);
      } else {
        setStatus("error");
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
        }, 2500);
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
      }, 2500);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            alt="App Logo"
            resizeMode="contain"
            style={styles.headerImg}
            source={{ uri: "https://mychits.co.in/assets/images/logo.png" }}
          />

          <Text style={styles.title}>Register</Text>

          <Text style={styles.subtitle}>
            Join our vision to make your life easy
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Full Name</Text>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="default"
              onChangeText={(name) => setForm({ ...form, name })}
              placeholder="eg. Ramesh Nayak"
              placeholderTextColor="#ccc"
              style={styles.inputControl}
              value={form.email}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Mobile Number</Text>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="number-pad"
              onChangeText={(mobile) => setForm({ ...form, mobile })}
              placeholder="eg. 9865874589"
              placeholderTextColor="#ccc"
              style={styles.inputControl}
              value={form.email}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Create Password</Text>

            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(password) => setForm({ ...form, password })}
              placeholder="********"
              placeholderTextColor="#ccc"
              style={styles.inputControl}
              value={form.password}
            />
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleRegister}>
              <LinearGradient
                colors={["#0053ca", "#002d6d"]}
                style={styles.btn}
              >
                <Text style={styles.btnText}>Register</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.formFooter}>
          Already have an account?{" "}
          <Text style={{ textDecorationLine: "underline" }}>Login</Text>
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LottieView
              source={
                status === "success"
                  ? require("../../assets/animations/success.json")
                  : require("../../assets/animations/failed.json")
              }
              autoPlay
              loop={false}
              style={{ width: 80, height: 80 }}
            />
            <Text style={styles.modalText}>
              {status === "success"
                ? "Registered Successful"
                : "Invalid Credentials"}
            </Text>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  title: {
    fontSize: 24,
    color: "#1D2A32",
    marginBottom: 6,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ccc",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 36,
  },
  headerImg: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  formFooter: {
    paddingVertical: 24,
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
    letterSpacing: 0.15,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  inputControl: {
    height: 45,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    borderWidth: 1,
    borderColor: "#e7e7e7",
    borderStyle: "solid",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "700",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
