import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import url from "../data/url";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState("success");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${url}/user/login-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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

          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>
            Get access to your chits very easily
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="number-pad"
                onChangeText={(mobile) => setForm({ ...form, mobile })}
                placeholder="eg. 9865874589"
                placeholderTextColor="#ccc"
                style={styles.inputControl}
                value={form.mobile}
              />
            </View>
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>

            <View style={styles.inputWrapper}>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(password) => setForm({ ...form, password })}
                placeholder="********"
                placeholderTextColor="#ccc"
                style={styles.inputControl}
                secureTextEntry={!passwordVisible}
                value={form.password}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={20}
                  color="#aaa"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleLogin}>
              <LinearGradient
                colors={["#0053ca", "#002d6d"]}
                style={styles.btn}
              >
                <Text style={styles.btnText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => { }}>
            <Text style={styles.formLink}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.formFooter}>
          Don't have an account?{" "}
          <Text style={{ textDecorationLine: "underline" }}>Register</Text>
        </Text>
      </TouchableOpacity>

      {/* Modal Popup */}
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
                ? "Login Successful"
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
    fontSize: 14,
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.3,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor:"#fff"
  },
  inputControl: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#000",
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
