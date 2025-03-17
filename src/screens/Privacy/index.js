import React from "react";
import { View, Text, ScrollView, SafeAreaView, StatusBar } from "react-native";
import CommonHeader from "../../components/CommonHeader";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS, fontFamily } from "../../../constants";

const sections = [
    { title: "Introduction", content: "At Travelogger, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.\n\nWe reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the 'Last updated' date of this Privacy Policy. Any changes or modifications will be effective immediately upon posting the updated Privacy Policy on the Site." },
    { title: "Information We Collect", subtitle: "Personal Information", content: "We may collect personal information that you voluntarily provide to us when you:\n- Register for an account\n- Create or modify your profile\n- Plan trips and create itineraries\n- Share travel experiences\n- Participate in community features\n- Contact us for support" },
    { subtitle: "Information We Collect Automatically", content: "When you access our platform, we may automatically collect:\n- Device information (type, operating system, browser)\n- Log data (IP address, access times, pages viewed)\n- Location data (with your permission)\n- Usage patterns and preferences" },
    { title: "How We Use Your Information", content: "We use the information we collect to:\n- Provide and maintain our services\n- Personalize your experience\n- Process your trip planning requests\n- Generate AI-powered travel recommendations\n- Facilitate community interactions\n- Send you relevant notifications\n- Improve our services\n- Detect and prevent fraud" },
    { title: "Information Sharing", content: "We may share your information with:\n- Service providers who assist in operating our platform\n- Other users (for community features, only with your consent)\n- Legal authorities when required by law\nWe do not sell your personal information to third parties." },
    { title: "Data Security", content: "We implement appropriate technical and organizational security measures to protect your information, including:\n- Encryption of data in transit and at rest\n- Regular security assessments\n- Access controls and authentication\n- Secure data storage practices" },
    { title: "Your Rights and Choices", content: "You have the right to:\n- Access your personal information\n- Correct inaccurate data\n- Request deletion of your data\n- Opt-out of marketing communications\n- Control your privacy settings\n- Export your data" },
    { title: "Cookies and Tracking", content: "We use cookies and similar tracking technologies to enhance your experience. You can control cookie settings through your browser preferences." },
    { title: "Children's Privacy", content: "Our services are not intended for users under the age of 13. We do not knowingly collect information from children under 13. If you become aware that a child has provided us with personal information, please contact us." },
    { title: "International Data Transfers", content: "Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers in accordance with applicable data protection laws." }
];

const Privacy = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
            <CommonHeader title="Privacy Policy" navigation={navigation} />
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                    {sections.map((section, index) => (
                        <View key={index}>
                            {section.title && (
                                <Text style={styles.title}>
                                    {`${index + 1}. ${section.title}`}
                                </Text>
                            )}
                            {section.subtitle && (
                                <Text style={styles.subtitle}>{`- ${section.subtitle}`}</Text>
                            )}
                            <Text style={styles.text}>{section.content}</Text>
                        </View>
                    ))}
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
        marginBottom: hp(5.5),
        marginHorizontal: wp(2),
    },
    title: {
        fontFamily: fontFamily.FONTS.bold,
        fontSize: hp(2.5),
        marginTop: hp(2),
        color: COLORS.darkgray,
    },
    subtitle: {
        fontFamily: fontFamily.FONTS.SemiBold,
        fontSize: hp(2),
        color: COLORS.darkgray1,
    },
    text: {
        paddingTop: hp(0.5),
        fontFamily: fontFamily.FONTS.Medium,
        fontSize: hp(1.8),
        lineHeight: hp(2.5),
        textAlign: "justify",
        color: COLORS.darkgray,
    },
};