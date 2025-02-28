import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS } from "../../../constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import Button from '../../components/Button';
import OTPVerification from '../../../assets/icons/OTP_Verification.svg'
import fontFamily from '../../../constants/fontFamily';

const OtpVerification = ({ navigation }) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [resendTimer, setResendTimer] = useState(30);
    const inputs = useRef([]);

    // Handle OTP input change
    const handleOtpChange = (value, index) => {
        let newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move focus to the next input field
        if (value && index < 3) {
            inputs.current[index + 1].focus();
        }
    };

    // Resend OTP Timer
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Handle OTP Submit
    const handleSubmit = () => {
        const enteredOtp = otp.join('');
        console.log("Entered OTP:", enteredOtp);
        navigation.navigate("CreatePassword")
        // Perform OTP verification logic here
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
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
                                ref={(el) => (inputs.current[index] = el)}
                                style={styles.otpBox}
                                maxLength={1}
                                keyboardType="numeric"
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                            />
                        ))}
                    </View>

                    {/* Submit Button */}
                    <Button
                        title="Send OTP"
                        color={COLORS.red}
                        onPress={handleSubmit}
                        style={styles.button}
                    />

                    {/* Resend Timer */}
                    <Text style={styles.resendText}>
                        Resend {resendTimer > 0 ? `00:${resendTimer < 10 ? `0${resendTimer}` : resendTimer}` : "Now"}
                    </Text>
                </View>
            </View>
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
        width: wp(60),
        marginBottom: hp(3),
    },
    otpBox: {
        width: wp(12),
        height: wp(12),
        borderRadius: wp(2),
        borderColor: COLORS.gray,
        borderWidth: 1,
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
    resendText: {
        fontSize: wp(4),
        color: COLORS.Midgray,
        marginTop: hp(2),
    },
});
