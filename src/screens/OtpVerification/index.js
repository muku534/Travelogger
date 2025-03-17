import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView, Platform, Keyboard, ToastAndroid, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS, fontFamily } from "../../../constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import Button from '../../components/Button';
import OTPVerification from '../../../assets/icons/OTP_Verification.svg'
import Toast from "react-native-toast-message";
import { verifyOTP } from '../../services/authService';

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
        Keyboard.dismiss();
        const OTP = otp.join("");

        if (OTP.length !== 6) {
            console.log("Invalid OTP length:", OTP.length);
            ToastAndroid.showWithGravity(
                'Enter the 6-digit OTP',
                ToastAndroid.SHORT,
                ToastAndroid.TOP,
            );
            return;
        }

        try {
            setLoading(true);
            const response = await verifyOTP(email, OTP);

            console.log("API Response:", response); // ✅ Debugging Response

            // ✅ Fix: Use response.statusCode instead of response.status
            if (response?.statusCode === 200) {
                console.log("OTP Verified! Redirecting to Create Password...");
                ToastAndroid.showWithGravity(
                    'OTP Verified! Redirecting...',
                    ToastAndroid.SHORT,
                    ToastAndroid.TOP,
                );

                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'CreatePassword', params: { email } }],
                    });
                }, 1000);
            } else {
                console.log("Unexpected Response:", response);
                const errorMessage = response?.message || "Something went wrong!";
                ToastAndroid.showWithGravity(
                    errorMessage,
                    ToastAndroid.SHORT,
                    ToastAndroid.TOP,
                );
            }
        } catch (error) {
            console.log("OTP Verification Failed:", error);

            if (response?.statusCode === 400) {
                ToastAndroid.showWithGravity(
                    'Invalid OTP. Please try again',
                    ToastAndroid.SHORT,
                    ToastAndroid.TOP,
                );
            } else if (response?.status === 500 && response?.data?.message.includes("Invalid or expired OTP")) {
                ToastAndroid.showWithGravity(
                    'Invalid or expired OTP',
                    ToastAndroid.SHORT,
                    ToastAndroid.TOP,
                );
            }
            else {
                ToastAndroid.showWithGravity(
                    'Something went wrong. Try again later!',
                    ToastAndroid.SHORT,
                    ToastAndroid.TOP,
                );
            }
        }

        setLoading(false);
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                    <ScrollView contentContainerStyle={{ flex: 1 }}>
                        <View style={styles.container}>
                            {/* Back Button */}
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                <Ionicons name="arrow-back" size={wp(6)} color={COLORS.darkgray} />
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
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
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
        fontSize: wp(6),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
        marginBottom: hp(1),
    },
    subtitle: {
        fontSize: wp(3.8),
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
        width: wp(12.5),
        height: wp(12.5),
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
