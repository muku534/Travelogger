import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, Linking, StyleSheet, ScrollView, SafeAreaView, StatusBar, Alert
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import vector icons
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS, fontFamily, SVGS } from "../../../constants";
import Toast from "react-native-toast-message";
import CommonHeader from "../../components/CommonHeader";
import Button from "../../components/Button";

const ContactUs = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [subject, setSubject] = useState("");
    const [loading, setLoading] = useState(false)
    // Validation function
    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

    // Handle form submission
    const handleSubmit = () => {
        if (!name || !email || !subject || !message) {
            Toast.show({ type: "error", text1: "Error", text2: "All fields are required!" });
            return;
        }
        if (!isValidEmail(email)) {
            Toast.show({ type: "error", text1: "Invalid Email", text2: "Please enter a valid email address." });
            return;
        }

        // Simulate form submission
        Toast.show({ type: "success", text1: "Message Sent", text2: "We'll get back to you soon!" });

        // Reset form
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
    };

    // Open external links (phone, email, website)
    const openLink = (type, value) => {
        let url = "";
        switch (type) {
            case "phone": url = `tel:${value}`; break;
            case "email": url = `mailto:${value}`; break;
            case "map":
                url = Platform.OS === "ios"
                    ? `http://maps.apple.com/?q=${encodeURIComponent(value)}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
                break;
            case "website": url = "https://www.travelogger.info/"; break;
            default: return;
        }
        Linking.openURL(url).catch(() => Alert.alert("Error", "Could not open link"));
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar backgroundColor={COLORS.white} barStyle={"dark-content"} />
            <CommonHeader title="Contact Us" navigation={navigation} />
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Contact Details */}
                <View style={styles.infoContainer}>
                    <TouchableOpacity onPress={() => openLink("map", "123 Travel Street, Adventure City, AC 12345")} style={styles.infoItem}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="location-outline" size={hp(3.2)} color={COLORS.darkgray} />
                            <Text style={styles.infoText}>123 Travel Street
                                Adventure City, AC 12345</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openLink("phone", "+1 (555) 123-4567")} style={styles.infoItem}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="call-outline" size={hp(3.2)} color={COLORS.darkgray} />
                            <Text style={styles.infoText}>+1 (555) 123-4567</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openLink("email", "contact@Travelogger.com")} style={styles.infoItem}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="mail-outline" size={hp(3.2)} color={COLORS.darkgray} />
                            <Text style={styles.infoText}>contact@Travelogger.com</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openLink("website")} style={styles.infoItem}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="globe-outline" size={hp(3.2)} color={COLORS.darkgray} />
                            <Text style={styles.infoText}>www.travelogger.info</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Contact Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Send Us a Message</Text>

                    <Text style={styles.label}>Your Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your name"
                        placeholderTextColor={COLORS.Midgray}
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Your Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor={COLORS.Midgray}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={styles.label}>Subject</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your Subject"
                        placeholderTextColor={COLORS.Midgray}
                        keyboardType="default"
                        value={subject}
                        onChangeText={setSubject}
                    />

                    <Text style={styles.label}>Your Message</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Write your message here..."
                        placeholderTextColor={COLORS.Midgray}
                        multiline
                        numberOfLines={4}
                        value={message}
                        onChangeText={setMessage}
                    />

                    {/* Submit Button */}
                    <Button
                        title={loading ? "Sending Message..." : "Send Message"}
                        onPress={handleSubmit}
                        disabled={loading}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ContactUs;

const styles = StyleSheet.create({
    container: {
        padding: wp(5),
        paddingBottom: hp(8)
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: hp(2),
        borderRadius: wp(2)
    },
    backButton: { marginRight: wp(3) },
    headerText: {
        fontSize: hp(2.5),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.white
    },
    infoContainer: {
        marginVertical: hp(1),
        alignItems: "center",
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        paddingVertical: hp(1.5),
        borderRadius: wp(2),
        width: "100%",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        marginBottom: hp(1.5),
    },
    iconContainer: {
        paddingHorizontal: wp(4),
        borderRadius: hp(5) / 2,
        backgroundColor: COLORS.primary,  // Match with app theme color
        justifyContent: "center",
        flexDirection: 'row',
        alignItems: "center",
        marginRight: wp(3),
    },
    infoText: {
        paddingHorizontal: wp(3),
        fontSize: hp(2),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.Medium,
    },
    formContainer: {

    },
    formTitle: {
        fontSize: hp(2.5),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
        marginBottom: hp(2), // Spacing below title
    },
    label: {
        fontSize: hp(2),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
        marginBottom: hp(0.5)
    },
    input: {
        borderWidth: 0.5,
        borderColor: COLORS.Midgray,
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray,
        borderRadius: wp(2),
        padding: hp(1.5),
        fontSize: hp(2),
        marginBottom: hp(2)
    },
    textArea: {
        height: hp(12),
        textAlignVertical: "top"
    },
});
