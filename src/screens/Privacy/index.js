import React from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS, fontFamily } from "../../../constants";
import CommonHeader from "../../components/CommonHeader";

const Privacy = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            <CommonHeader title="Privacy Policy" navigation={navigation} />
            <View style={styles.container}>
                {/* Scrollable Content */}
                <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                    <Text style={styles.text}>
                        Lorem ipsum dolor sit amet consectetur. Ac sit in mi interdum malesuada ante in scelerisque. Odio mauris amet in sed justo scelerisque porttitor elit diam. Maecenas porttitor amet sociis tortor. Justo quis est habitant amet nascetur gravida. Morbi velit feugiat velit fringilla sed dictumst pretium bibendum sem. Volutpat ultricies ultricies purus nunc accumsan scelerisque nibh elit. Pellentesque ultricies tincidunt donec lobortis sit blandit. Diam scelerisque sed sed diam ultricies nibh adipiscing dapibus.
                        {"\n\n"}
                        Platea at vitae ac egestas eget praesent. Bibendum vitae turpis consectetur adipiscing faucibus bibendum cursus turpis. Sollicitudin tellus urna feugiat nunc sed orci elit sagittis gravida. Facilisis nibh ipsum mauris urna vestibulum molestie ac tellus. Dignissim mauris lacus nec vitae iaculis aliquam erat aliquam.
                        {"\n\n"}
                        Lorem ipsum dolor sit amet consectetur. Ac sit in mi interdum malesuada ante in scelerisque. Odio mauris amet in sed justo scelerisque porttitor elit diam. Maecenas porttitor amet sociis tortor. Justo quis est habitant amet nascetur gravida. Morbi velit feugiat velit fringilla sed dictumst pretium bibendum sem.
                        {"\n\n"}
                        Volutpat ultricies ultricies purus nunc accumsan scelerisque nibh elit. Pellentesque ultricies tincidunt donec lobortis sit blandit. Diam scelerisque sed sed diam ultricies nibh adipiscing dapibus. Platea at vitae ac egestas eget praesent. Bibendum vitae turpis consectetur adipiscing faucibus bibendum cursus turpis. Sollicitudin tellus urna feugiat nunc sed orci elit sagittis gravida. Facilisis nibh ipsum mauris urna vestibulum molestie ac tellus. Dignissim mauris lacus nec vitae iaculis aliquam erat aliquam.
                    </Text>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default Privacy;

const styles = {
    container: {
        flex: 1,
        marginTop: hp(2),
        paddingHorizontal: wp(3),
    },
    content: {
        flex: 1,
        marginHorizontal: wp(2),
    },
    text: {
        fontFamily: fontFamily.FONTS.Medium,
        fontSize: hp(1.8),
        lineHeight: hp(2.5),
        textAlign: "justify",
        color: COLORS.darkgray,
    },
};
