import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import url from "../data/url";
import Header from "../components/layouts/Header";
import axios from "axios";

const cardsData = [
  {
    groupName: "Group A",
    groupValue: "100000",
    endDate: "2024-12-31",
    profitPercentage: 1000,
  },
  {
    groupName: "Group B",
    groupValue: "150000",
    endDate: "2024-11-30",
    profitPercentage: 1500,
  },
  {
    groupName: "Group C",
    groupValue: "200000",
    endDate: "2024-10-31",
    profitPercentage: 2000,
  },
  {
    groupName: "Group D",
    groupValue: "300000",
    endDate: "2025-01-15",
    profitPercentage: 2100,
  },
  {
    groupName: "Group E",
    groupValue: "500000",
    endDate: "2024-09-30",
    profitPercentage: 3200,
  },
];

const EnrollGroup = ({ route, navigation }) => {
  const { userId, groupId, ticket } = route.params;
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [groups, setGroups] = useState({});
  const [paymentData, setPaymentData] = useState([]);
  const [error, setError] = useState(null);
  const [singleOverview, setSingleOverview] = useState({});
  const [auctions, setAuctions] = useState([])

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`${url}/group/get-by-id-group/${groupId}`);
        if (response.ok) {
          const data = await response.json();
          setGroups(data);
        } else {
          console.error("Failed to fetch groups.");
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const fetchTicketData = async () => {
    try {
      const response = await fetch(`${url}/payment/payment-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: groupId,
          userId: userId,
          ticket: ticket,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred");
        setPaymentData([]);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setPaymentData(data.data); // Use the `data` array from the response
        setError(null);
      } else {
        setError(data.message || "No data available");
        setPaymentData([]);
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
      setError("An error occurred");
      setPaymentData([]);
    }
  };

  useEffect(() => {
    fetchTicketData();
  }, []);

  useEffect(() => {
    const fetchAllOverview = async () => {
      try {
        const response = await axios.get(`${url}/single-overview?user_id=${userId}&group_id=${groupId}&ticket=${ticket}`)
        setSingleOverview(response.data)
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    }
    fetchAllOverview()
  }, [userId, groupId, ticket])

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await fetch(`${url}/auction/get-group-auction/${groupId}`);
        if (response.ok) {
          const data = await response.json();
          setAuctions(data);
        } else {
          console.error("Failed to fetch auctions.");
        }
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchAuction();
  }, [groupId]);

  return (
    <>
      <Header userId={userId} navigation={navigation} />
      <View style={styles.container}>
        <View style={styles.dropdownContainer}>
          <Text style={{ marginVertical: 5, fontWeight: "900", fontSize: 18 }}>
            {groups.group_name} - {ticket}
          </Text>
        </View>
        <View style={styles.row}>
          <View style={[styles.card, { backgroundColor: "#004775" }]}>
            <Text style={[styles.amount, { color: "#fff" }]}>₹ {singleOverview.totalPaid || 0}</Text>
            <Text style={[styles.label, { color: "#fff" }]}>Investment</Text>
          </View>
          <View style={[styles.card, { backgroundColor: "#357500" }]}>
            <Text style={[styles.amount, { color: "#fff" }]}>₹ {singleOverview.totalProfit || 0}</Text>
            <Text style={[styles.label, { color: "#fff" }]}>Divident / Profit</Text>
          </View>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AuctionsRecord', { userId: userId, groupId: groupId, ticket: ticket })}
            style={[styles.card, { borderColor: "#b68900", borderWidth: 0.4 }]}
          >
            <Text style={[styles.amount, { color: "#b68900" }]}>₹ {groups.group_type === 'double' ? singleOverview.totalInvestment || 0 : singleOverview.totalPayable + parseFloat(auctions[0]?.divident_head || 0) || 0}</Text>
            <Text style={[styles.label, { color: "#b68900" }]}>To Be Paid</Text>
          </TouchableOpacity>
          <View
            style={[styles.card, { borderColor: "#008a41", borderWidth: 0.4 }]}
          >
            <Text style={[styles.amount, { color: "#008a41" }]}>₹ {singleOverview.totalPaid || 0}</Text>
            <Text style={[styles.label, { color: "#008a41" }]}>Total Paid</Text>
          </View>
          <View
            style={[styles.card, { borderColor: "#bd0000", borderWidth: 0.4 }]}
          >
            <Text style={[styles.amount, { color: "#bd0000" }]}>
              ₹ {Math.abs(groups.group_type === 'double' ? (singleOverview.totalInvestment - singleOverview.totalPaid || 0) : (singleOverview.totalPayable + parseFloat(auctions[0]?.divident_head || 0)) - (singleOverview.totalPaid || 0))}
            </Text>
            <Text style={[styles.label, { color: "#bd0000" }]}>
              Balance
              {groups.group_type === "double"
                ? (singleOverview.totalInvestment - (singleOverview.totalPaid || 0)) < 0
                  ? "(excess)"
                  : ""
                : (singleOverview.totalPayable + parseFloat(auctions[0]?.divident_head || 0)) - (singleOverview.totalPaid || 0) < 0
                  ? "(excess)"
                  : ""}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              fontSize: 16,
            }}
          >
            Last 10 Transactions
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("ViewMore", { userId: userId, groupId: groupId, ticket: ticket })}>
            <Text style={{ color: "#007BFF" }}>View More</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {paymentData.length > 0 ? (
            paymentData.map((card, index) => (
              <View
                key={card._id}
                style={[
                  styles.cards,
                  selectedCardIndex === index && styles.selectedCard,
                ]}
              >
                <View style={styles.leftSide}>
                  <Text style={styles.profitText}>
                    {card.receipt_no ? card.receipt_no : card.old_receipt_no || ""}
                  </Text>
                </View>
                <View style={styles.centerSide}>
                  <Text style={styles.profitText}>
                    {card.pay_date.split("-").reverse().join("-")}
                  </Text>
                </View>
                <View style={styles.rightSide}>
                  <Text style={styles.groupName}>₹{card.amount}</Text>
                </View>
              </View>

            ))
          ) : error ? (
            <Text style={{ color: "red", textAlign: "center", marginTop: 30 }}>{error}</Text>
          ) : (
            <Text style={{ textAlign: "center", marginTop: 30 }}>Loading...</Text>
          )}
        </ScrollView>
        {/* <TouchableOpacity
        style={styles.chooseGroupButton}
        onPress={() => navigation.navigate("EnrollForm")}
      >
        <Text style={styles.buttonText}>Unsubscribe</Text>
      </TouchableOpacity> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  card: {
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
  chooseGroupButton: {
    backgroundColor: "#e00000",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 70,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 15,
  },
  cards: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },
  selectedCard: {
    backgroundColor: "#eee8f7",
    borderColor: "#451d53",
  },
  leftSide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  centerSide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rightSide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  groupName: {
    fontWeight: "600",
    fontSize: 16,
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
});

export default EnrollGroup;
