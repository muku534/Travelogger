import React from "react";
import { View, Image, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "./Pixel/Index";
import { COLORS, Images, SVGS } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import DeviceInfo from "react-native-device-info";

const isTablet = DeviceInfo.isTablet();

const BasicHeader = () => {
    const navigation = useNavigation()
    return (
        <View style={styles.header}>
            <Image source={Images.travelLoggerLogo} style={styles.logo} />

            <View style={styles.headerIcons}>
                <TouchableOpacity onPress={() => navigation.navigate("Explore", { isSearchOnly: true })}>
                    <SVGS.SEARCH width={isTablet ? wp(5.5) : wp(8.5)} height={hp(4)} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("NotificationScreen")}>
                    <SVGS.BELL
                        width={isTablet ? wp(5.5) : wp(8.5)}
                        height={hp(4)}
                        style={styles.notificationIcon}
                    />
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
        paddingHorizontal: isTablet ? wp(0) : wp(3),
        marginTop: Platform.OS === "ios" ? hp(0) : hp(5),
        paddingBottom: hp(1),
        backgroundColor: COLORS.white,
    },
    logo: {
        height: hp(4),
        width: isTablet ? wp(14) : wp(35),
        resizeMode: "contain",
    },
    headerIcons: {
        flexDirection: "row",
        alignItems: "center",
    },
    notificationIcon: {
        marginLeft: isTablet ? wp(0) : wp(2),
    },
});
