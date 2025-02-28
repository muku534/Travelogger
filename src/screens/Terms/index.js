import React from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS } from "../../../constants";
import fontFamily from "../../../constants/fontFamily";

const Terms = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={wp(6)} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Terms and Conditions</Text>
                </View>

                {/* Scrollable Content */}
                <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                    <Text style={styles.text}>
                        Lorem ipsum dolor sit amet consectetur. Ac sit in mi
                        interdum malesuada ante in scelerisque. Odio mauris
                        amet in sed justo scelerisque porttitor elit diam.
                        Maecenas porttitor amet sociis tortor. Justo quis est
                        habitant amet nascetur gravida. Morbi velit feugiat velit
                        fringilla sed dictumst pretium bibendum sem. Volutpat
                        ultricies ultricies purus nunc accumsan scelerisque nibh
                        elit. Pellentesque ultrices tincidunt donec lobortis sit
                        blandit. Diam scelerisque sed sed diam ultricies nibh
                        adipiscing dapibus. Platea ac vitae ac egestas eget
                        praesent. Bibendum vitae turpis consectetur adipiscing
                        faucibus bibendum cursus turpis. Sollicitudin tellus urna
                        feugiat nunc sed orci elit sagittis gravida. Facilisis nibh
                        ipsum mauris urna vestibulum molestie ac tellus.
                        Dignissim mauris lacus nec vitae iaculis aliquam erat
                        aliquam. Tortor senectus tellus commodo vel.Lorem
                        ipsum dolor sit amet consectetur. Ac sit in mi interdum
                        malesuada ante in scelerisque. Odio mauris amet in sed
                        justo scelerisque porttitor elit diam. Maecenas porttitor
                        amet sociis tortor. Justo quis est habitant amet nascetur
                        gravida. Morbi velit feugiat velit fringilla sed dictumst
                        pretium bibendum sem. Volutpat ultricies ultricies purus
                        nunc accumsan scelerisque nibh elit. d dictumst pretium
                        bibendum sem. Volutpat ultricies ultricies purus nunc
                        accumsan scelerisque nibh elit. Pellentesque ultrices
                        tincidunt donec lobortis sit blandit. Diam scelerisque sed
                        sed diam ultricies nibh adipiscing dapibus. Platea ac vitae
                        ac egestas eget praesent. Bibendum vitae turpis
                        consectetur adipiscing faucibus bibendum cursus turpis.
                        Sollicitudin tellus urna feugiat nunc sed orci elit sagittis
                        gravida. Facilisis nibh ipsum mauris urna vestibulum
                        molestie ac tellus. Dignissim mauris lacus nec vitae iaculis
                        aliquam erat aliquam.
                    </Text>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default Terms;

const styles = {
    container: {
        flex: 1,
        marginTop: hp(5),
        paddingHorizontal: wp(3),
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: hp(2.5),
    },
    headerTitle: {
        fontSize: wp(5),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
        marginLeft: wp(3),
    },
    content: {
        flex: 1,
        marginVertical: hp(2),
        marginHorizontal: wp(2),
    },
    text: {
        fontSize: wp(3.8),
        lineHeight: hp(2.5),
        textAlign: "justify",
        color: "#444",
    },
};
