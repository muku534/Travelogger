import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Keyboard } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS, fontFamily } from "../../../constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import Button from '../../components/Button';
import OTPVerification from '../../../assets/icons/OTP_Verification.svg'
import Toast from 'react-native-toast-message';
import { verifyOTP } from '../../services/authService';
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet();

const OtpVerification = ({ navigation, route }) => {
    const { email } = route.params;
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const inputRefs = Array(6).fill().map(() => useRef());

    const handleOTPChange = (value, index) => {
        if (!/^\d?$/.test(value)) return; // Ensure only numbers are entered

        let newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move focus to next input field
        if (value && index < 5) {
            inputRefs[index + 1].current.focus();
        }
    };

    // Handle backspace
    const handleBackspace = (index) => {
        let newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);

        if (index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handleSubmitOTP = async () => {
        const OTP = otp.join("");

        if (OTP.length !== 6) {
            Toast.show({ type: "error", text1: "Invalid OTP", text2: "Enter the 6-digit OTP." });
            return;
        }

        setLoading(true);
        try {
            await verifyOTP(email, OTP);
            Toast.show({ type: "success", text1: "OTP Verified", text2: "You can now create a new password." });
            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'CreatePassword', params: { email } }], // ✅ Correct way to pass email
                });
            }, 1000);
        } catch (error) {
            Toast.show({ type: "error", text1: "Verification Failed", text2: error.message || "Invalid OTP." });
        }
        setLoading(false);
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={dismissKeyboard}>
                        <View style={styles.container}>
                            {/* Back Button */}
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                <Ionicons name="arrow-back" size={isTablet ? wp(3) : wp(6)} color={COLORS.darkgray} />
                            </TouchableOpacity>

                            <View style={{ flex: 1, alignItems: 'center' }}>
                                {/* OTP Illustration */}
                                <View style={styles.imageContainer}>
                                    <OTPVerification width={wp(60)} height={hp(25)} />
                                </View>

                                {/* Title */}
                                <Text style={styles.title}>OTP Verification</Text>

                                {/* Subtitle */}
                                <Text style={styles.subtitle}>Please enter the OTP to create the New Password</Text>

                                {/* OTP Input Fields */}
                                <View style={styles.otpContainer}>
                                    {otp.map((digit, index) => (
                                        <TextInput
                                            key={index}
                                            ref={inputRefs[index]}
                                            style={styles.otpBox}
                                            maxLength={1}
                                            keyboardType="numeric"
                                            value={digit}
                                            onChangeText={(value) => handleOTPChange(value, index)}
                                            onKeyPress={({ nativeEvent }) => {
                                                if (nativeEvent.key === "Backspace") {
                                                    handleBackspace(index);
                                                }
                                            }}
                                        />
                                    ))}
                                </View>

                                {/* Submit Button */}
                                <Button
                                    title={loading ? "Verifying OTP..." : "Verify OTP"}
                                    onPress={handleSubmitOTP}
                                    disabled={loading}
                                />

                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
};

export default OtpVerification;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        paddingHorizontal: wp(4),
    },
    backButton: {
        marginTop: hp(8),
    },
    title: {
        fontSize: isTablet ? wp(2.5) : wp(6),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
        marginBottom: hp(1),
    },
    subtitle: {
        fontSize: isTablet ? wp(2) : wp(3.8),
        textAlign: 'center',
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.Midgray,
        marginBottom: hp(4),
        width: wp(80),
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(3),
    },
    otpBox: {
        width: isTablet ? wp(8) : wp(12.5),
        height: isTablet ? wp(8) : wp(12.5),
        borderRadius: wp(2),
        borderColor: COLORS.Midgray,
        marginHorizontal: wp(1.5),
        color: COLORS.darkgray,
        borderWidth: 0.7,
        textAlign: 'center',
        fontSize: wp(5),
        fontFamily: fontFamily.FONTS.bold
    },
    button: {
        width: wp(90),
        alignSelf: 'center',
        borderRadius: wp(3),
        justifyContent: 'center',
        alignItems: 'center',
    },
});