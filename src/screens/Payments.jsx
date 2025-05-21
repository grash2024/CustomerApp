import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import url from "../data/url";
import axios from "axios";
import Header from "../components/layouts/Header";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const Payments = ({ navigation, route }) => {
  const { userId } = route.params;
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({});

  const [TotalToBepaid, setTotalToBePaid] = useState("")
  const [Totalpaid, setTotalPaid] = useState("")
  const [Totalprofit, setTotalProfit] = useState("")

  const fetchTickets = async () => {
    try {
      const response = await axios.post(
        `${url}/enroll/get-user-tickets/${userId}`
      );
      const data = await response.data;
      setCardsData(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTickets();
    }
  }, [userId]);

  const fetchAllOverview = async () => {
    try {
      const response = await axios.post(`${url}/enroll/get-user-tickets-report/${userId}`)
      setOverview(response.data)
      const totalToBePaidAmount = response.data.reduce(
        (sum, group) => sum + (group?.payable?.totalPayable + parseInt(group?.enrollment?.group?.group_install) || 0),
        0
      );
      setTotalToBePaid(totalToBePaidAmount)

      const totalPaidAmount = response.data.reduce(
        (sum, group) => sum + (group?.payments?.totalPaidAmount || 0),
        0
      );
      setTotalPaid(totalPaidAmount)

      const totalProfit = response.data.reduce(
        (sum, group) => sum + (group?.profit?.totalProfit || 0),
        0
      );
      setTotalProfit(totalProfit)
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  }

  useEffect(() => {
    fetchAllOverview()
  }, [userId])

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
      fetchAllOverview();
    }, [userId])
  );

  return (
    <>
      <Header userId={userId} navigation={navigation} />
      <View style={styles.container}>
        <View style={styles.dropdownContainer}>
          <Text style={{ marginVertical: 10, fontWeight: "900", fontSize: 18 }}>
            My Groups & Payments
          </Text>
        </View>
        <View style={styles.row}>
          <View style={[styles.cards, { backgroundColor: "#004775" }]}>
            <Text style={[styles.amount, { color: "#fff" }]}>₹ {Totalpaid || 0}</Text>
            <Text style={[styles.label, { color: "#fff" }]}>
              Total Investment
            </Text>
          </View>
          <View style={[styles.cards, { backgroundColor: "#357500" }]}>
            <Text style={[styles.amount, { color: "#fff" }]}>₹ {Totalprofit || 0}</Text>
            <Text style={[styles.label, { color: "#fff" }]}>Total Divident / Profit</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {cardsData
              .filter((card) => card.group_id !== null)
              .map((card, index) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EnrollGroup", {
                      userId: userId,
                      groupId: card.group_id._id,
                      ticket: card.tickets,
                    })
                  }
                  key={index}
                  style={[
                    styles.card,
                    selectedCardIndex === index && styles.selectedCard,
                  ]}
                >
                  <View style={styles.leftSide}>
                    <Text style={[styles.groupName, { marginBottom: 10 }]}>
                      {card.group_id.group_name}
                    </Text>
                    <Text style={{ fontSize: 14 }}>Ticket: {card.tickets}</Text>
                  </View>
                  <View style={styles.rightSide}>
                    <Text style={styles.profitText}>View</Text>
                    <MaterialIcons name="chevron-right" size={24} color="#585858" />
                  </View>
                </TouchableOpacity>
              ))}

          </ScrollView>
        )}
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
  picker: {
    height: 50,
    width: "100%",
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  scrollContainer: {
    paddingBottom: 50,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ededed",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 15,
  },
  selectedCard: {
    backgroundColor: "#eee8f7",
    borderColor: "#451d53",
  },
  leftSide: {
    flex: 1,
  },
  rightSide: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupName: {
    fontWeight: "700",
    fontSize: 18,
  },
  groupValue: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
    marginBottom: 10,
  },
  endDate: {
    fontSize: 12,
    color: "#777",
  },
  profitText: {
    fontSize: 12,
    marginRight: 10,
    color: "#000",
    fontWeight: "500",
  },
  radioButton: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#6200ea",
    backgroundColor: "transparent",
  },
  selectedRadio: {
    backgroundColor: "#451d53",
  },
  chooseGroupButton: {
    backgroundColor: "#451d53",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 90,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: 10,
  },
  cards: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    margin: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  amount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  loader: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});

export default Payments;
