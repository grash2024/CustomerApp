import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const Fq = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/animations/comingSoon.json")}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:width * 0.6,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: width * 0.05,
  },
  animation: {
    width: width * 0.6,
    height: width * 0.6,
  },
  text: {
    marginTop: height * 0.02,
    fontSize: width * 0.05,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});

export default Fq;
