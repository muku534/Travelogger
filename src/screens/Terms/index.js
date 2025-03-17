import React from "react";
import { View, Text, ScrollView, SafeAreaView, StatusBar } from "react-native";
import CommonHeader from "../../components/CommonHeader";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS, fontFamily } from "../../../constants";

const sections = [
    { number: "1.", title: "Agreement to Terms", content: "By accessing or using Travelogger's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site." },
    { number: "2.", title: "Use License", content: "Permission is granted to temporarily access and use Travelogger's services for personal, non-commercial use, subject to the following restrictions:\n- You must not modify or copy the materials without explicit permission\n- You must not use the materials for any commercial purpose\n- You must not attempt to reverse engineer any software contained on Travelogger's platform\n- You must not remove any copyright or proprietary notations from the materials" },
    { number: "3.", title: "User Accounts", content: "When creating an account with us, you must provide accurate and complete information. You are responsible for:\n- Maintaining the confidentiality of your account credentials\n- All activities that occur under your account\n- Notifying us immediately of any unauthorized use of your account\n- Ensuring your account information is accurate and up-to-date" },
    { number: "4.", title: "User Content", content: "By posting content on Travelogger, including travel experiences, photos, and reviews, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, publicly display, and distribute such content on our platform.\n\nYou agree not to post content that:\n- Is false, misleading, or deceptive\n- Infringes on any third party's intellectual property rights\n- Contains harmful software or malicious code\n- Violates any applicable laws or regulations\n- Harasses, abuses, or threatens others" },
    { number: "5.", title: "Travel Planning Services", content: "Our travel planning services, including AI-powered recommendations, are provided 'as is' and:\n- Should be used as suggestions only and verified independently\n- May not be suitable for all travelers or circumstances\n- Are subject to availability and accuracy of third-party information\n- May be modified or discontinued at any time" },
    { number: "6.", title: "Community Guidelines", content: "When using our community features, you agree to:\n- Respect other users and their privacy\n- Provide accurate and honest information\n- Not engage in harassment or discriminatory behavior\n- Not spam or post promotional content without authorization\n- Report inappropriate content or behavior" },
    { number: "7.", title: "Intellectual Property", content: "The Travelogger platform, including its original content, features, and functionality, is owned by Travelogger and protected by international copyright, trademark, and other intellectual property laws." },
    { number: "8.", title: "Limitation of Liability", content: "Travelogger shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service. This includes but is not limited to:\n- Loss of profits, data, or other intangibles\n- Cost of substitute services\n- Travel-related incidents or accidents\n- Service interruptions or technical issues" },
    { number: "9.", title: "Termination", content: "We may terminate or suspend your account and access to our services immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason." },
    { number: "10.", title: "Changes to Terms", content: "We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the platform. Your continued use of Travelogger after such modifications constitutes your acceptance of the updated terms." },
    { number: "11.", title: "Governing Law", content: "These terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions." }
];

const Terms = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
            <CommonHeader title="Terms of Service" navigation={navigation} />
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                    {sections.map((section, index) => (
                        <View key={index}>
                            <Text style={styles.title}>{section.number} {section.title}</Text>
                            <Text style={styles.text}>{section.content}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default Terms;

const styles = {
    container: {
        flex: 1,
        marginTop: hp(2),
        paddingHorizontal: wp(3),
    },
    content: {
        flex: 1,
        marginBottom: hp(5),
        marginHorizontal: wp(2),
    },
    title: {
        fontFamily: fontFamily.FONTS.bold,
        fontSize: hp(2.2),
        marginTop: hp(2),
        color: COLORS.black,
    },
    text: {
        fontFamily: fontFamily.FONTS.Medium,
        fontSize: hp(1.8),
        lineHeight: hp(2.5),
        textAlign: "justify",
        color: COLORS.darkgray,
        marginTop: hp(1),
    },
};
