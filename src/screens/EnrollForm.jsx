import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";  // For right arrow icon
import axios from "axios";
import url from "../data/url";
import Header from "../components/layouts/Header";

const EnrollForm = ({ navigation, route }) => {
  const { groupId, userId } = route.params;
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [ticketCount, setTicketCount] = useState(1); // Counter value
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [cardsData, setCardsData] = useState({});
  const [availableTickets, setAvailableTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`${url}/group/get-by-id-group/${groupId}`);
        if (response.ok) {
          const data = await response.json();
          setCardsData(data);
        } else {
          console.error("Failed to fetch groups.");
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false); // Set loading to false when data is loaded
      }
    };

    fetchGroups();
  }, []);
  useEffect(() => {
    if (groupId) {
      axios
        .post(`${url}/enroll/get-next-tickets/${groupId}`)
        .then((response) => {
          setAvailableTickets(response.data.availableTickets || []);
        })
        .catch((error) => {
          console.error("Error fetching available tickets:", error);
        });
    } else {
      setAvailableTickets([]);
    }
  }, [groupId]);

  const handleEnroll = async () => {
    const ticketsCount = parseInt(ticketCount, 10);
    const ticketEntries = availableTickets
      .slice(0, ticketsCount)
      .map((ticketNumber) => ({
        group_id: groupId,
        user_id: userId,
        no_of_tickets: ticketCount,
        tickets: ticketNumber,
      }));

    try {
      for (const ticketEntry of ticketEntries) {
        await axios.post(`${url}/enroll/add-enroll`, ticketEntry, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      navigation.navigate("EnrollConfirm", {
        group_name: cardsData.group_name,
        tickets: ticketCount,
        userId: userId
      });
    } catch (error) {
      console.error("Error enrolling user:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#451d53" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Header userId={userId} navigation={navigation} />
      <View style={styles.container}>
        <Text
          style={{
            marginHorizontal: 20,
            fontWeight: "700",
            fontSize: 18,
            marginTop: 20,
          }}
        >
          Group Information
        </Text>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            key={cardsData._id}
            colors={["#6ea7f7", "#ccddf5"]}
            style={[
              styles.card,
              selectedCardIndex === cardsData._id && styles.selectedCard,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.leftSide}>
              <Text style={styles.groupName}>{cardsData.group_name}</Text>
              <View style={styles.groupInfoContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.groupValue}>₹ {cardsData.group_value}</Text>
                  <Text style={styles.groupValue}>
                    ₹ {cardsData.group_install}/Month
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text
                    style={[
                      styles.groupValue,
                      { color: "green", fontWeight: "900" },
                    ]}
                  >
                    {availableTickets.length} Seats are vacant
                  </Text>
                  <Text style={styles.groupValue}>
                    {cardsData.group_duration} Months
                  </Text>
                </View>
              </View>
              <Text style={styles.endDate}>
                Starts at{" "}
                {new Date(cardsData.start_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}{" "}
                & Ends in:{" "}
                {new Date(cardsData.end_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>
          </LinearGradient>

          <Text style={styles.sliderLabel}>
            Number of Tickets
          </Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              onPress={() => setTicketCount((prev) => Math.max(1, prev - 1))}
              style={styles.counterButton}
            >
              <AntDesign name="minus" size={20} color="red" />
            </TouchableOpacity>
            <View style={styles.counterBox}>
              <Text style={styles.counterText}>{ticketCount}</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                setTicketCount((prev) =>
                  Math.min(availableTickets.length, prev + 1)
                )
              }
              style={styles.counterButton}
            >
              <AntDesign name="plus" size={20} color="green" />
            </TouchableOpacity>
          </View>

          {/* Terms and Conditions Checkboxes */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              <View
                style={[
                  styles.checkboxInner,
                  termsAccepted && styles.checkboxChecked,
                ]}
              >
                {termsAccepted && <Text style={styles.checkboxText}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>
                Accept Terms and Conditions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setPrivacyAccepted(!privacyAccepted)}
            >
              <View
                style={[
                  styles.checkboxInner,
                  privacyAccepted && styles.checkboxChecked,
                ]}
              >
                {privacyAccepted && <Text style={styles.checkboxText}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Accept Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <TouchableOpacity
          style={[
            styles.chooseGroupButton,
            {
              backgroundColor:
                !termsAccepted || !privacyAccepted || availableTickets.length <= 0 ? "#ddd" : "#001d47",
            },
          ]}
          onPress={handleEnroll}
          disabled={!termsAccepted || !privacyAccepted || availableTickets.length <= 0}
        >
          <Text
            style={[
              styles.buttonText,
              { color: !termsAccepted || !privacyAccepted || availableTickets.length <= 0 ? "#aaa" : "#fff" },
            ]}
          >
            Apply{" "}
            <AntDesign
              name="arrowright"
              size={20}
              color={!termsAccepted || !privacyAccepted || availableTickets.length <= 0 ? "#aaa" : "#fff"}
            />
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingBottom: 15,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 25,
    marginVertical: 10,
    borderRadius: 10,
    marginHorizontal: 15,
  },
  selectedCard: {
    backgroundColor: "#eee8f7",
  },
  leftSide: {
    flex: 1,
  },
  groupName: {
    fontWeight: "900",
    fontSize: 18,
  },
  groupInfoContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  groupValue: {
    fontSize: 14,
    color: "#000",
    marginTop: 15,
  },
  endDate: {
    fontSize: 12,
    color: "#000",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    marginBottom: 90,
  },
  counterButton: {
    padding: 10,
  },
  counterBox: {
    borderWidth: 1,
    borderColor: "#451d53",
    paddingVertical: 5,
    paddingHorizontal: 50,
    marginHorizontal: 10,
    borderRadius: 20
  },
  counterText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#451d53",
  },
  checkboxContainer: {
    marginHorizontal: 15,
    marginTop: 20,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 10,
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#001d47",
  },
  checkboxText: {
    color: "#fff",
    fontWeight: "bold",
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: "#000",
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
  sliderLabel: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 0,
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default EnrollForm;
