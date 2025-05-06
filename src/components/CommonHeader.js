import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "./Pixel/Index";
import { COLORS, fontFamily, Images, SVGS } from "../../constants";
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet();

const CommonHeader = ({ title, navigation }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={isTablet ? wp(3) : wp(6)} color={COLORS.darkgray} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    );
};

export default CommonHeader;

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp(3),
        backgroundColor: COLORS.white,
        paddingTop: Platform.OS === "ios" ? hp(0) : hp(6),
    },
    headerTitle: {
        fontSize: isTablet ? wp(2) : wp(5),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
        marginLeft: wp(3), // Spacing for back button
    },
});
