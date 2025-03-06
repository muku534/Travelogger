import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "./Pixel/Index";
import { COLORS, Images, SVGS } from "../../constants";

const BasicHeader = () => {
    return (
        <View style={styles.header}>
            <Image source={Images.travelLoggerLogo} style={styles.logo} />

            <View style={styles.headerIcons}>
                <TouchableOpacity>
                    <SVGS.SEARCH width={wp(8.5)} height={hp(4)} />
                </TouchableOpacity>
                <TouchableOpacity>
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
        marginTop: hp(5),
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
