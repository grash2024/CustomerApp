import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import url from "../data/url";
import Header from "../components/layouts/Header";

const ViewMore = ({ route, navigation }) => {
  const { userId, groupId, ticket } = route.params;
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [isFromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [isToDatePickerVisible, setToDatePickerVisible] = useState(false);
  const [groups, setGroups] = useState({});
  const [paymentData, setPaymentData] = useState([]);
  const [error, setError] = useState(null);

  const handleFromDateChange = (event, selectedDate) => {
    setFromDatePickerVisible(false);
    if (selectedDate) {
      setFromDate(selectedDate);
    }
  };

  const handleToDateChange = (event, selectedDate) => {
    setToDatePickerVisible(false);
    if (selectedDate) {
      setToDate(selectedDate);
    }
  };

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
          from: fromDate.toISOString().split("T")[0],
          to: toDate.toISOString().split("T")[0],
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
        setPaymentData(data.data);
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
  }, [fromDate.toISOString().split("T")[0], toDate.toISOString().split("T")[0]]);

  return (
    <>
      <Header userId={userId} navigation={navigation} />
      <View style={styles.container}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.headerText}>Transactions</Text>

          <View style={styles.dateContainer}>
            <View style={styles.dateInputWrapper}>
              <Text>From Date</Text>
              <TouchableOpacity
                onPress={() => setFromDatePickerVisible(true)}
                style={styles.dateInput}
              >
                <TextInput
                  placeholder="From Date"
                  value={fromDate.toISOString().split("T")[0]}
                  editable={false}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.dateInputWrapper}>
              <Text>To Date</Text>
              <TouchableOpacity
                onPress={() => setToDatePickerVisible(true)}
                style={styles.dateInput}
              >
                <TextInput
                  placeholder="To Date"
                  value={toDate.toISOString().split("T")[0]}
                  editable={false}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                    #{card.receipt_no}
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
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.loadingText}>Loading...</Text>
          )}
        </ScrollView>

        {/* From Date Picker */}
        {isFromDatePickerVisible && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display="default"
            onChange={handleFromDateChange}
          />
        )}

        {/* To Date Picker */}
        {isToDatePickerVisible && (
          <DateTimePicker
            value={toDate}
            mode="date"
            display="default"
            onChange={handleToDateChange}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  dropdownContainer: {
    backgroundColor: "transparent",
    marginBottom: 20,
  },
  headerText: {
    marginVertical: 10,
    fontWeight: "900",
    fontSize: 18,
    textAlign: "start",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  dateInputWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateInput: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginTop: 5,
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
    fontWeight: "700",
    fontSize: 18,
  },
  profitText: {
    fontSize: 12,
    marginRight: 10,
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 30,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
  },
});

export default ViewMore;
