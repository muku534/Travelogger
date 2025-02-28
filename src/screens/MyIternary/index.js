import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS } from "../../../constants";
import BellIcon from '../../../assets/icons/notification.svg';      // Replace with actual file path 
import LinearGradient from 'react-native-linear-gradient';
import SearchIcon from '../../../assets/icons/search.svg';

import MoreIcon from '../../../assets/icons/more.svg'; // Adjust the path based on your project structure
import fontFamily from "../../../constants/fontFamily";

// Replace with actual file path
// Dummy Data
const trips = [
    {
        id: "1",
        image: require("../../../assets/images/Canada.png"),
        location: "Canada, USA",
        title: "Canada, USA 2025",
        date: "18/2/25 - 19/2/2025",
        price: "$300",
    },
];

const MyItinerary = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            <View style={styles.container}>
                {/* 🔴 Fixed Header */}
                <View style={styles.header}>
                    <Image source={require('../../../assets/images/travelogger_logo.png')} style={styles.logo} />

                    <View style={styles.headerIcons}>
                        <TouchableOpacity>
                            <SearchIcon width={wp(8.5)} height={hp(4)} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <BellIcon width={wp(8.5)} height={hp(4)} style={styles.notificationIcon} />
                        </TouchableOpacity>
                    </View>
                </View>


                {/* Trip List */}
                <FlatList
                    data={trips}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate("PlanTripDetails")} activeOpacity={0.7}>
                            <View style={styles.card}>
                                <Image source={item.image} style={styles.cardImage} />
                                <View style={styles.cardContent}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Ionicons name="location-outline" size={wp(4)} />
                                        <Text style={styles.cardLocation}>
                                            {item.location}
                                        </Text>
                                    </View>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Ionicons name="calendar-outline" size={wp(4)} />
                                        <Text style={styles.cardDate}>
                                            {item.date}
                                        </Text>
                                    </View>
                                    <Text style={styles.cardPrice}>{item.price}</Text>
                                </View>

                                <TouchableOpacity style={styles.moreButton}>
                                    <MoreIcon width={wp(6)} height={wp(6)} />
                                </TouchableOpacity>

                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

export default MyItinerary;

const styles = {
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: wp(3),
        marginTop: hp(5),
        paddingBottom: hp(1),
        backgroundColor: COLORS.white,
    },
    logo: {
        height: hp(4),
        width: wp(35),
        resizeMode: 'contain',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationIcon: {
        marginLeft: wp(2),
    },
    iconSpacing: {
        marginLeft: wp(4),
    },
    card: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        borderColor: COLORS.Midgray,
        borderWidth: 0.7,
        borderRadius: wp(3),
        marginHorizontal: wp(3),
        marginVertical: hp(1),
    },
    cardImage: {
        width: wp(28),
        height: '100%',
        resizeMode: "cover",
        borderTopLeftRadius: wp(3), // Top-left corner rounded
        borderBottomLeftRadius: wp(3), // Bottom-left corner rounded
    },
    cardContent: {
        flex: 1,
        padding: wp(3),
    },
    cardLocation: {
        fontSize: wp(3.8),
        color: COLORS.darkgray1,
        fontFamily: fontFamily.FONTS.Medium,
    },
    cardTitle: {
        fontSize: wp(4.5),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
    },
    cardDate: {
        fontSize: wp(3.8),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray1,
    },
    cardPrice: {
        fontSize: wp(4),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
    },

    moreButton: {
        alignItems: "center",  // Center align both icons
        justifyContent: "space-between", // Space between icons
        padding: wp(4),
        marginBottom: hp(1), // Space between icons
    },
    floatingButton: {
        position: "absolute",
        bottom: hp(10),
        alignSelf: "center",
        backgroundColor: "red",
        padding: wp(4),
        borderRadius: wp(10),
        elevation: 5,
    },
    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: hp(2),
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    navItem: {
        alignItems: "center",
    },
    activeTab: {
        alignItems: "center",
    },
};
