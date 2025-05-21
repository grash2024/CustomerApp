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

const AuctionsRecord = ({ route, navigation }) => {
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
            const response = await fetch(`${url}/auction/get-group-auction/${groupId}`);
            if (response.ok) {
                const data = await response.json();
                setPaymentData(data);
            } else {
                console.error("Failed to fetch auctions.");
            }
        } catch (error) {
            console.error("Error fetching auctions:", error);
        }
    };

    useEffect(() => {
        fetchTicketData();
    }, [groupId]);

    return (
        <>
            <Header userId={userId} navigation={navigation} />
            <View style={styles.container}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10 }}>
                    <View style={styles.dropdownContainer}>
                        <Text style={styles.headerText}>Auctions</Text>
                    </View>
                    <View style={styles.dropdownContainer}>
                        <Text style={[styles.headerText, { color: "green" }]}>
                            ₹
                            {groups.group_type === 'double' ? parseInt(groups.group_install) + (parseInt(groups.group_install) * paymentData.length) :
                                parseInt(groups.group_install) +
                                paymentData.reduce((total, card) => total + parseInt(card.payable), 0) +
                                (paymentData[0]?.divident_head ? parseInt(paymentData[0].divident_head) : 0)
                            }
                        </Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View
                        key={groups._id}
                        style={[styles.cards]}
                    >
                        <View style={styles.row}>
                            <Text style={styles.leftText}>Comencement</Text>
                            <Text style={[styles.rightText, { fontWeight: "900", color: "green" }]}>
                                Payable: ₹{groups.group_install}
                            </Text>
                        </View>
                    </View>
                    {paymentData.length > 0 ? (
                        paymentData.map((card, index) => (
                            <View
                                key={card._id}
                                style={[
                                    styles.cards,
                                    selectedCardIndex === index && styles.selectedCard,
                                ]}
                            >
                                <View style={styles.row}>
                                    <Text style={styles.leftText}>
                                        Auction Date: {card.auction_date.split("-").reverse().join("-")}
                                    </Text>
                                    <Text style={styles.rightText}>
                                        Next Date: {card.next_date.split("-").reverse().join("-")}
                                    </Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.leftText}>Win Ticket: {card.ticket}</Text>
                                    <Text
                                        style={[
                                            styles.rightText,
                                            { fontWeight: "900", color: "green" },
                                        ]}
                                    >
                                        Payable: ₹
                                        {groups.group_type === "double"
                                            ? groups.group_install
                                            : index === 0
                                                ? parseInt(card.payable) + parseInt(paymentData[0].divident_head)
                                                : parseInt(card.payable)}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : (
                        ""
                    )}

                </ScrollView>

                {isFromDatePickerVisible && (
                    <DateTimePicker
                        value={fromDate}
                        mode="date"
                        display="default"
                        onChange={handleFromDateChange}
                    />
                )}

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
        marginBottom: 0,
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
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
    },
    leftText: {
        flex: 1,
        textAlign: "left",
        fontSize: 14,
        color: "#333",
    },
    rightText: {
        flex: 1,
        textAlign: "right",
        fontSize: 14,
        color: "#333",
    },
    cards: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 10,
        marginHorizontal: 10
    },
    selectedCard: {
        borderWidth: 1,
        borderColor: "#007bff",
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
    profitText: {
        fontSize: 12,
        marginRight: 10,
        color: "green",
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

export default AuctionsRecord;
