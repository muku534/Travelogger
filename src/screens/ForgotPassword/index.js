import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import React, { useState } from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS } from "../../../constants";
import fontFamily from "../../../constants/fontFamily";
import Ionicons from "react-native-vector-icons/Ionicons";
import ForgotPasswordImage from "../../../assets/images/Forgot_Password.svg";
import Button from '../../components/Button';
import Email from '../../../assets/icons/email.svg';
import Toast from 'react-native-toast-message';  // Import Toast

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (email.trim() === '') {
            // Show a toast message if email is not entered
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Email required',
                text2: 'Please enter your email address before proceeding.',
                visibilityTime: 3000,
            });
            return;
        }

        setLoading(true);
        // Simulate a network request here
        setTimeout(() => {
            setLoading(false);
            navigation.navigate("CreatePassword", { email });
        }, 200); // Simulating network request with timeout
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
            <View style={styles.container}>
                {/* Header */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={wp(6)} color={COLORS.darkgray} />
                </TouchableOpacity>

                {/* Forgot Password Icon */}
                <View style={styles.svgContainer}>
                    <ForgotPasswordImage width={hp(35)} height={hp(20)} />
                </View>

                {/* Forgot Password Title */}
                <Text style={styles.title}>Forgot Password</Text>

                {/* Instruction Text */}
                <Text style={styles.instruction}>
                    Please enter the Email ID that you have registered for the Travelogger account.
                </Text>

                {/* Input Field */}
                <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                        <Email width={hp(2.6)} height={hp(2.6)} />
                        <TextInput
                            placeholder="Email ID"
                            placeholderTextColor={COLORS.darkgray}
                            keyboardType="email-address"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            editable={!loading}
                        />
                    </View>
                </View>

                {/* Submit Button */}
                <Button
                    title={"Continue"}
                    color={COLORS.red}
                    onPress={handleSubmit}
                    style={styles.button}
                    disabled={loading}
                />
            </View>

            {/* Toast container */}
            <Toast />
        </SafeAreaView>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        marginTop: hp(5),
        paddingHorizontal: wp(4),
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: hp(2),
        left: wp(4),
    },
    svgContainer: {
        marginTop: hp(10),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(5),
    },
    title: {
        fontSize: wp(6),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
        marginBottom: hp(1),
    },
    instruction: {
        fontSize: wp(3.7),
        paddingHorizontal: wp(2),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray1,
        textAlign: 'center',
        marginBottom: hp(3),
    },
    inputWrapper: {
        width: '100%',
        marginBottom: hp(2),
    },
    inputContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        height: hp(6),
        borderColor: COLORS.Midgray,
        borderWidth: 0.5,
        borderRadius: wp(2),
        paddingLeft: wp(2),
    },
    input: {
        flex: 1,
        paddingLeft: wp(2),
        color: COLORS.darkgray,
        fontSize: wp(4),
    },
    button: {
        width: wp(90),
        alignSelf: 'center',
        borderRadius: wp(3),
        justifyContent: 'center',
        alignItems: 'center',
    },
});
