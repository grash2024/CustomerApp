import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { AntDesign } from "@expo/vector-icons"; // Make sure to install expo/vector-icons
import Header from "../components/layouts/Header";

const EnrollConfirm = ({ navigation, route }) => {
  const { group_name, tickets, userId } = route.params;
  const [scaleValue] = React.useState(new Animated.Value(0));
  React.useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 200,
      useNativeDriver: true,
    }).start();
  }, [scaleValue]);

  return (
    <>
      <View style={styles.container}>
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <AntDesign name="checkcircle" size={100} color="green" />
        </Animated.View>
        <Text style={styles.congratulationsText}>
          Congratulations! You successfully enrolled for {group_name} with{" "}
          {tickets} tickets.
        </Text>
        <Text style={styles.activationText}>Account will be activated soon.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("BottomTab", {
              screen: "PaymentScreen",
            }, { userId: userId })
          }
        >
          <Text style={styles.buttonText}>Go to My Groups</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
  },
  congratulationsText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#333",
  },
  activationText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#001d47",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EnrollConfirm;
