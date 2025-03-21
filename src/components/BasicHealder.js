import React from "react";
import { View, Image, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "./Pixel/Index";
import { COLORS, Images, SVGS } from "../../constants";
import { useNavigation } from "@react-navigation/native";

const BasicHeader = () => {
    const navigation = useNavigation()
    return (
        <View style={styles.header}>
            <Image source={Images.travelLoggerLogo} style={styles.logo} />

            <View style={styles.headerIcons}>
                <TouchableOpacity onPress={() => navigation.navigate("Explore", { isSearchOnly: true })}>
                    <SVGS.SEARCH width={wp(8.5)} height={hp(4)} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("NotificationScreen")}>
                    <SVGS.BELL width={wp(8.5)} height={hp(4)} style={styles.notificationIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BasicHeader;

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: wp(3),
        marginTop: Platform.OS === "ios" ? hp(0) : hp(5),
        paddingBottom: hp(1),
        backgroundColor: COLORS.white,
    },
    logo: {
        height: hp(4),
        width: wp(35),
        resizeMode: "contain",
    },
    headerIcons: {
        flexDirection: "row",
        alignItems: "center",
    },
    notificationIcon: {
        marginLeft: wp(2),
    },
});
