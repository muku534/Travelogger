import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Modal, SafeAreaView, StatusBar } from "react-native";
import DatePicker from "react-native-date-picker";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS } from "../../../constants";
import fontFamily from "../../../constants/fontFamily";
import SoloSVG from "../../../assets/icons/Solo_icon.svg";
import CoupleSVG from "../../../assets/icons/Couple_icon.svg";
import GroupSVG from "../../../assets/icons/family.svg";
import BudgetSVG from "../../../assets/icons/Budget_icon.svg";
import ModerateSVG from "../../../assets/icons/Moderate_icon.svg";
import LuxurySVG from "../../../assets/icons/Luxury_icon.svg";
import ItalianSVG from "../../../assets/icons/Italian_icon.svg";
import JapaneseSVG from "../../../assets/icons/Japanese_icon.svg";
import MexicanSVG from "../../../assets/icons/Mexican_icon.svg";
import AsianSVG from "../../../assets/icons/Asian_icon.svg";
import LocalSVG from "../../../assets/icons/Local_icon.svg";
import HealthySVG from "../../../assets/icons/Healthy_icon.svg";
import Calendar from "../../../assets/icons/calendarai_icon.svg";

const AIPlanTrip = ({ navigation }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(5) }} >
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={wp(6)} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.header}>Plan your Perfect Trip</Text>
                    </View>

                    {/* Destination Input */}
                    <Text style={styles.label}>Destination</Text>
                    <TextInput placeholder="Enter here" style={styles.input} />

                    {/* Start Date Picker */}
                    <Text style={styles.label}>Start Date</Text>
                    <View style={styles.dateInput}>
                        <Text style={styles.dateText}>{startDate ? startDate.toDateString() : "Select Start Date"}</Text>
                        <TouchableOpacity onPress={() => setOpenStartDate(true)}>
                            <Calendar width={wp(6)} height={hp(6)} />
                        </TouchableOpacity>
                    </View>
                    {openStartDate && (
                        <DatePicker
                            modal
                            open={openStartDate}
                            date={startDate || new Date()}
                            mode="date"
                            onConfirm={(date) => { setOpenStartDate(false); setStartDate(date); }}
                            onCancel={() => setOpenStartDate(false)}
                        />
                    )}

                    {/* End Date Picker */}
                    <Text style={styles.label}>End Date</Text>
                    <View style={styles.dateInput}>
                        <Text style={styles.dateText}>{endDate ? endDate.toDateString() : "Select End Date"}</Text>
                        <TouchableOpacity onPress={() => setOpenEndDate(true)}>
                            <Calendar width={wp(6)} height={hp(6)} />
                        </TouchableOpacity>
                    </View>
                    {openEndDate && (
                        <DatePicker
                            modal
                            open={openEndDate}
                            date={endDate || new Date()}
                            mode="date"
                            onConfirm={(date) => { setOpenEndDate(false); setEndDate(date); }}
                            onCancel={() => setOpenEndDate(false)}
                        />
                    )}

                    {/* Who is Traveling Section */}
                    <Text style={styles.sectionTitle}>Who is Travelling</Text>
                    <View style={styles.optionsContainer}>
                        {[
                            { name: "Solo", icon: <SoloSVG width={wp(10)} height={hp(5)} /> },
                            { name: "Couple", icon: <CoupleSVG width={wp(10)} height={hp(5)} /> },
                            { name: "Family/Group", icon: <GroupSVG width={wp(10)} height={hp(5)} /> },
                        ].map((item, index) => (
                            <TouchableOpacity key={index} style={styles.option}>
                                {item.icon}
                                <Text style={styles.optionText}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Budget Range */}
                    <Text style={styles.sectionTitle}>What is your Budget Range</Text>
                    <View style={styles.optionsContainer}>
                        {[
                            { name: "Budget", subtitle: "Under $100/day", icon: <BudgetSVG width={wp(10)} height={hp(5)} /> },
                            { name: "Moderate", subtitle: "Under $200-$300/day", icon: <ModerateSVG width={wp(10)} height={hp(5)} /> },
                            { name: "Luxury", subtitle: "Over $300/day", icon: <LuxurySVG width={wp(10)} height={hp(5)} /> },
                        ].map((item, index) => (
                            <TouchableOpacity key={index} style={styles.option}>
                                {item.icon}
                                <Text style={styles.optionText}>{item.name}</Text>
                                <Text style={styles.optionSubText}>{item.subtitle}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Cuisine Preferences */}
                    <Text style={styles.sectionTitle}>Select your Preferred Cuisines</Text>
                    <Text style={styles.sectionSubTitle}>optional Choose Upto 3</Text>
                    <View style={styles.optionsContainer}>
                        {[
                            { name: "Italian", icon: <ItalianSVG width={wp(10)} height={hp(5)} /> },
                            { name: "Japanese", icon: <JapaneseSVG width={wp(10)} height={hp(5)} /> },
                            { name: "Mexican", icon: <MexicanSVG width={wp(10)} height={hp(5)} /> },
                            { name: "Asian", icon: <AsianSVG width={wp(10)} height={hp(5)} /> },
                            { name: "Local", icon: <LocalSVG width={wp(10)} height={hp(5)} /> },
                            { name: "Healthy", icon: <HealthySVG width={wp(10)} height={hp(5)} /> },
                        ].map((item, index) => (
                            <TouchableOpacity key={index} style={styles.option}>
                                {item.icon}
                                <Text style={styles.optionText}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Popular Destinations */}
                    <Text style={styles.sectionTitle}>Popular Destinations</Text>
                    <View style={styles.destinationsContainer}>
                        {[
                            { name: "Bali", img: require("../../../assets/images/Bali.png") },
                            { name: "Thailand", img: require("../../../assets/images/Thailand.png") },
                            { name: "Turkey", img: require("../../../assets/images/Turkey.png") },
                        ].map((dest, index) => (
                            <View key={index} style={styles.destination}>
                                <Image source={dest.img} style={styles.destinationImage} />
                                <Text style={styles.destinationText}>{dest.name}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Generate Trip Button */}
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("LoadingScreen")}>
                        <LinearGradient
                            colors={["#5100E6", "#008075"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.buttonText}>Generate a Trip</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AIPlanTrip;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: hp(6.2),
        paddingHorizontal: wp(3),
        backgroundColor: "#fff",
    },
    headerContainer: {
        marginBottom: hp(3),
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        marginRight: wp(2), // Add spacing from title
    },
    header: {
        fontSize: wp(5),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
    },
    label: {
        fontSize: wp(4),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
        marginBottom: hp(1),
    },
    input: {
        borderWidth: 0.5,
        borderColor: COLORS.Midgray,
        borderRadius: wp(2),
        height: hp(6),
        paddingHorizontal: wp(3),
        fontSize: wp(4),
        marginBottom: hp(2),
    },
    dateInput: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: COLORS.Midgray,
        borderRadius: wp(2),
        height: hp(6),
        paddingHorizontal: wp(3),
        fontSize: wp(4),
        marginBottom: hp(2),
    },
    dateText: {
        color: COLORS.darkgray,
    },
    sectionTitle: {
        fontSize: wp(4.5),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
        marginBottom: hp(0.9),
    },
    sectionSubTitle: {
        fontSize: wp(4.5),
        color: COLORS.Midgray,
        fontFamily: fontFamily.FONTS.Medium,
        marginBottom: hp(1),
    },
    optionsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: hp(1),
    },
    option: {
        width: wp(29), // Ensuring uniform width
        height: hp(14), // Ensuring uniform height
        borderColor: '#D2E1E5',
        borderWidth: 1,
        backgroundColor: COLORS.white,
        borderRadius: wp(2),
        alignItems: "center",
        justifyContent: "center",
        marginBottom: hp(1),
    },

    optionText: {
        textAlign: "center",
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.Medium,
        fontSize: hp(1.7),
        marginTop: hp(1),
    },
    optionSubText: {
        fontSize: hp(1.3),
        color: COLORS.Midgray,
        fontFamily: fontFamily.FONTS.Medium,
        paddingVertical: hp(0.5),
    },
    destinationsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    destination: {
        width: "30%",
        alignItems: "center",
    },
    destinationImage: {
        width: wp(29),
        height: hp(13),
        resizeMode: 'contain',
        borderRadius: wp(4),
    },
    destinationText: {
        marginTop: hp(1),
        fontSize: wp(4),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
    },
    button: {
        marginTop: hp(3),
        alignSelf: "center",
    },
    gradientButton: {
        width: wp(92),
        paddingVertical: hp(2),
        borderRadius: wp(2),
        alignItems: "center",
    },
    buttonText: {
        color: COLORS.white,
        fontSize: wp(4.5),
        fontFamily: fontFamily.FONTS.bold
    },
});

