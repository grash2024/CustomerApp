import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import url from "../data/url";
import Header from "../components/layouts/Header";

const Enrollment = ({ route, navigation }) => {
  const { userId } = route.params;
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [cardsData, setCardsData] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("All Groups");
  const [isLoading, setIsLoading] = useState(true);
  const [isGroupSelected, setIsGroupSelected] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`${url}/group/get-group`);
        if (response.ok) {
          const data = await response.json();
          setCardsData(data);
          setIsLoading(false);
        } else {
          console.error("Failed to fetch groups.");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <>
      <Header userId={userId} navigation={navigation} />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leftContent}>
            <Text style={styles.headerText}>{selectedGroup}</Text>
          </View>
          <TouchableOpacity
            style={styles.filterIcon}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="filter" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#6200ea" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {cardsData.map((card, index) => (
              <View
                key={index}
                style={[
                  styles.card,
                  selectedCardIndex === index && styles.selectedCard,
                ]}
              >
                <View style={styles.leftSide}>
                  <Text style={styles.groupName}>{card.group_name}</Text>
                  <Text style={styles.groupValue}>₹ {card.group_value}</Text>
                  <Text style={styles.endDate}>
                    Starts at:{" "}
                    {new Date(card.start_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                  <Text style={styles.endDate}>
                    ends in:{" "}
                    {new Date(card.end_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                <View style={styles.rightSide}>
                  <Text style={styles.profitText}>Join</Text>
                  <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => setSelectedCardIndex(index)}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        selectedCardIndex === index && styles.selectedRadio,
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
        <Modal
          visible={filterModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setFilterModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Filter Groups</Text>

              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedGroup === "All Groups" && styles.selectedFilter,
                ]}
                onPress={() => {
                  setSelectedGroup("All Groups");
                  setFilterModalVisible(false);
                }}
              >
                <Text style={styles.filterText}>All Groups</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedGroup === "New Groups" && styles.selectedFilter,
                ]}
                onPress={() => {
                  setSelectedGroup("New Groups");
                  setFilterModalVisible(false);
                }}
              >
                <Text style={styles.filterText}>New Groups</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedGroup === "Ongoing Groups" && styles.selectedFilter,
                ]}
                onPress={() => {
                  setSelectedGroup("Ongoing Groups");
                  setFilterModalVisible(false);
                }}
              >
                <Text style={styles.filterText}>Ongoing Groups</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.chooseGroupButton}
          onPress={() => {
            if (selectedCardIndex !== null) {
              const selectedGroupId = cardsData[selectedCardIndex]._id;
              navigation.navigate("EnrollForm", { groupId: selectedGroupId });
            } else {
              setIsGroupSelected(true);
            }
          }}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.icon} />
          </View>
        </TouchableOpacity>
        <Modal
          visible={isGroupSelected}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsGroupSelected(false)}
        >
          <View style={[styles.modalOverlay, {}]}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Please select a group to continue!</Text>
              <TouchableOpacity
                style={styles.filterOption}
                onPress={() => setIsGroupSelected(false)}
              >
                <Text style={[styles.filterText, { color: "red" }]}>Close</Text>
              </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  leftContent: {
    flex: 1,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  filterIcon: {
    padding: 5,
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
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 15,
  },
  selectedCard: {
    backgroundColor: "#ccddf5",
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
    fontWeight: "900",
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
    borderColor: "#001d47",
    backgroundColor: "transparent",
  },
  selectedRadio: {
    backgroundColor: "#001d47",
  },
  chooseGroupButton: {
    backgroundColor: "#001d47",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 35,
    borderRadius: 10,
    alignItems: "center",
    maxWidth: 700,
    width: "90%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  filterOption: {
    padding: 15,
    width: "100%",
    alignItems: "center",
  },
  selectedFilter: {
    backgroundColor: "#f0e6fb",
    borderRadius: 15
  },
  filterText: {
    fontSize: 14,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10,
  },
});

export default Enrollment;
