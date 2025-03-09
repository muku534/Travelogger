import React from "react";
import {
    View, Text, TouchableOpacity, Linking, StyleSheet, ScrollView, SafeAreaView, StatusBar, Alert
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import vector icons
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS, fontFamily } from "../../../constants";
import CommonHeader from "../../components/CommonHeader";

const ContactUs = ({ navigation }) => {
    // Open external links (phone, email, website)
    const openLink = (type, value) => {
        let url = "";
        switch (type) {
            case "phone": url = `tel:${value}`; break;
            case "email": url = `mailto:${value}`; break;
            case "map": url = "https://maps.google.com/?q=New+York+City,USA"; break;
            case "website": url = "https://www.yourtravelapp.com"; break;
            default: return;
        }
        Linking.openURL(url).catch(() => Alert.alert("Error", "Could not open link"));
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />
            <CommonHeader title="Contact Us" navigation={navigation} />
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* Contact Details */}
                <View style={styles.infoContainer}>
                    <TouchableOpacity onPress={() => openLink("map")}>
                        <Text style={styles.infoText}>
                            <Ionicons name="location-outline" size={hp(2.5)} /> New York City, USA
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openLink("phone", "+1 234 567 890")}>
                        <Text style={styles.infoText}>
                            <Ionicons name="call-outline" size={hp(2.5)} /> +1 234 567 890
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openLink("email", "support@yourtravelapp.com")}>
                        <Text style={styles.infoText}>
                            <Ionicons name="mail-outline" size={hp(2.5)} /> support@yourtravelapp.com
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openLink("website")}>
                        <Text style={styles.infoText}>
                            <Ionicons name="globe-outline" size={hp(2.5)} /> www.yourtravelapp.com
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Social Media Icons */}
                <View style={styles.socialContainer}>
                    <TouchableOpacity onPress={() => openLink("website")}>
                        <Ionicons name="logo-instagram" size={hp(4)} color={COLORS.darkgray} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openLink("website")}>
                        <Ionicons name="logo-facebook" size={hp(4)} color={COLORS.darkgray} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openLink("website")}>
                        <Ionicons name="logo-twitter" size={hp(4)} color={COLORS.darkgray} />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default ContactUs;

const styles = StyleSheet.create({
    container: { padding: wp(5), paddingBottom: hp(10) },
    infoContainer: { marginVertical: hp(3), alignItems: "center" },
    infoText: { fontSize: hp(2), color: COLORS.darkgray, marginBottom: hp(1), justifyContent: 'center', alignItems: 'center' },
    socialContainer: { flexDirection: "row", justifyContent: "center", marginTop: hp(3) },
});
