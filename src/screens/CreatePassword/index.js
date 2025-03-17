import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, ScrollView, Keyboard } from 'react-native';
import React, { useState } from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS, fontFamily } from "../../../constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import CreatePasswordImage from "../../../assets/images/Create_Password.svg";
import Button from '../../components/Button';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Toast from 'react-native-toast-message';  // Import Toast for notifications
import { updatePassword } from '../../services/authService';

const CreatePassword = ({ route, navigation }) => {
    const { email } = route.params; // Assume the email is passed via navigation

    const [form, setForm] = useState({
        password: '',
        confirmPassword: '',
    });
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setForm(prevState => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        const { password, confirmPassword } = form;

        // Validate if passwords are empty
        if (!password || !confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'All fields are required!',
                text2: 'Please make sure both password fields are filled.',
            });
            return;
        }

        // Validate if passwords match
        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Password mismatch!',
                text2: 'Your passwords do not match. Please try again.',
            });
            return;
        }
        try {
            setLoading(true);
            // Change field name to match API requirements
            const requestedData = {
                email: email,
                newPassword: password,
                confirmPassword: confirmPassword
            };

            const response = await updatePassword(requestedData);

            // Show success message
            Toast.show({
                type: 'success',
                text1: 'Password updated successfully!',
                text2: 'You can now log in with your new password.',
            });
            // Navigate to Login screen
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });

        } catch (error) {
            // Show error message
            Toast.show({
                type: 'error',
                text1: 'Error updating password!',
                text2: error.message || 'Something went wrong, please try again.',
            });
        } finally {
            setLoading(false);
        }
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
                            {/* Header */}
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}>
                                <Ionicons name="arrow-back" size={wp(6)} color={COLORS.darkgray} />
                            </TouchableOpacity>

                            <View style={{ flex: 1, alignItems: 'center' }}>
                                {/* Forgot Password Icon */}
                                <View style={styles.svgContainer}>
                                    <CreatePasswordImage width={hp(35)} height={hp(25)} />
                                </View>

                                {/* Forgot Password Title */}
                                <Text style={styles.title}>Create Password</Text>

                                {/* Instruction Text */}
                                <Text style={styles.instruction}>
                                    Create a Strong Password that you will never forget again
                                </Text>

                                {/* Input Field */}
                                {/* Password Input */}
                                <InputField
                                    label="Password"
                                    icon={<MaterialCommunityIcons name="lock-outline" size={hp(3)} color={COLORS.darkgray1} />}
                                    placeholder="Password"
                                    value={form.password}
                                    secureTextEntry={isPasswordShown}
                                    onChangeText={(text) => handleChange('password', text)}
                                    editable={!loading}
                                    toggleSecure={() => setIsPasswordShown(!isPasswordShown)}
                                    isSecure={isPasswordShown}
                                />

                                {/* Confirm Password Input */}
                                <InputField
                                    label="Confirm Password"
                                    icon={<MaterialCommunityIcons name="lock-outline" size={hp(3)} color={COLORS.darkgray1} />}
                                    placeholder="Re-Enter Password"
                                    value={form.confirmPassword}
                                    secureTextEntry={isConfirmPasswordShown}
                                    onChangeText={(text) => handleChange('confirmPassword', text)}
                                    editable={!loading}
                                    toggleSecure={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                                    isSecure={isConfirmPasswordShown}
                                />

                                {/* Submit Button */}
                                <View style={{ marginVertical: hp(2) }}>
                                    <Button
                                        title={loading ? "Updating..." : "Confirm Password"}
                                        color={COLORS.red}
                                        onPress={handleSubmit}
                                        style={styles.button}
                                        disabled={loading}
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const InputField = ({ label, icon, placeholder, value, onChangeText, secureTextEntry, editable, toggleSecure, isSecure }) => (
    <View>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputContainer}>
            {icon}
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={COLORS.darkgray}
                secureTextEntry={secureTextEntry}
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                editable={editable}
            />
            {toggleSecure && (
                <TouchableOpacity onPress={toggleSecure} style={styles.eyeIcon}>
                    <MaterialIcons name={isSecure ? "visibility-off" : "visibility"} size={24} color={COLORS.darkgray1} />
                </TouchableOpacity>
            )}
        </View>
    </View>
);

export default CreatePassword;

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
    svgContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(3),
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
    label: {
        fontSize: hp(1.8),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
    },
    inputContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(1),
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
        fontFamily: fontFamily.FONTS.Medium,
        fontSize: wp(4),
    },
    eyeIcon: {
        position: 'absolute',
        right: wp(4),
    },
    button: {
        width: wp(90),
        alignSelf: 'center',
        borderRadius: wp(3),
        justifyContent: 'center',
        alignItems: 'center',
    },
});
