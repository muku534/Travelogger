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
import AIIcon from '../../../assets/icons/AiTrip.svg';

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

const AIIternary = ({ navigation }) => {
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
                        <TouchableOpacity onPress={() => navigation.navigate("AiPlanTripDetails")} activeOpacity={0.7}>
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
                                <View style={styles.moreContainer}>
                                    {/* More Icon */}
                                    <TouchableOpacity style={styles.moreButton}>
                                        <MoreIcon width={wp(6)} height={wp(6)} />
                                    </TouchableOpacity>

                                    {/* New Icon with Gradient */}
                                    <LinearGradient
                                        colors={["#5100E6", "#008075"]} // Gradient Colors
                                        start={{ x: 0, y: 0 }} // Left
                                        end={{ x: 1, y: 0 }}   // Right
                                        style={styles.gradientIconContainer}
                                    >
                                        <AIIcon width={hp(2.5)} height={hp(2.5)} />
                                    </LinearGradient>

                                </View>

                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

export default AIIternary;

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
        borderColor: '#DAC6FF',
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
    moreContainer: {
        alignItems: "center",  // Center align both icons
        padding: wp(2),
        justifyContent: "space-between", // Space between icons
    },

    moreButton: {
        padding: wp(2),
        marginBottom: hp(1), // Space between icons
    },

    gradientIconContainer: {
        width: wp(8),  // Adjust as needed
        height: wp(8), // Adjust as needed
        borderRadius: wp(4), // Make it circular
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",  // Ensures gradient doesn't leak
    },
    navItem: {
        alignItems: "center",
    },
    activeTab: {
        alignItems: "center",
    },
};
