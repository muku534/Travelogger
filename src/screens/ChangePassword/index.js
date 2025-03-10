import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS, fontFamily } from "../../../constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Button from '../../components/Button';
import logger from '../../utils/logger';
import Toast from 'react-native-toast-message';
import CommonHeader from '../../components/CommonHeader'

const ChangePassword = ({ navigation }) => {
    const [form, setForm] = useState({
        email: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isNewPasswordShown, setIsNewPasswordShown] = useState(true);
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setForm(prevState => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        const { email, newPassword, confirmPassword } = form;

        // Validate fields
        if (!email || !newPassword || !confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'All fields are required!',
                text2: 'Please fill in all fields before proceeding.',
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Password mismatch!',
                text2: 'New password and confirm password must be the same.',
            });
            return;
        }

        try {
            setLoading(true);

            const requestedData = {
                email: email,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            };

            await updatePassword(requestedData);

            Toast.show({
                type: 'success',
                text1: 'Password updated successfully!',
                text2: 'You can now log in with your new password.',
            });

            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Update failed!',
                text2: error.message || 'Something went wrong, please try again.',
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

            <CommonHeader title="Change Password" navigation={navigation} />
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ marginVertical: hp(3), paddingHorizontal: wp(5), alignItems: 'center' }}>
                    <InputField
                        label="Email"
                        icon={<MaterialCommunityIcons name="email-outline" size={hp(3)} color={COLORS.darkgray1} />}
                        placeholder="Enter your email"
                        value={form.email}
                        onChangeText={(text) => handleChange('email', text)}
                        editable={!loading}
                    />

                    <InputField
                        label="New Password"
                        icon={<MaterialCommunityIcons name="lock-outline" size={hp(3)} color={COLORS.darkgray1} />}
                        placeholder="Enter new password"
                        value={form.newPassword}
                        secureTextEntry={isNewPasswordShown}
                        onChangeText={(text) => handleChange('newPassword', text)}
                        editable={!loading}
                        toggleSecure={() => setIsNewPasswordShown(!isNewPasswordShown)}
                        isSecure={isNewPasswordShown}
                    />

                    <InputField
                        label="Confirm New Password"
                        icon={<MaterialCommunityIcons name="lock-outline" size={hp(3)} color={COLORS.darkgray1} />}
                        placeholder="Confirm new password"
                        value={form.confirmPassword}
                        secureTextEntry={isConfirmPasswordShown}
                        onChangeText={(text) => handleChange('confirmPassword', text)}
                        editable={!loading}
                        toggleSecure={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                        isSecure={isConfirmPasswordShown}
                    />

                </View>
                <Button
                    title={loading ? "Updating..." : "Update Password"}
                    onPress={handleSubmit}
                    disabled={loading}
                />
            </View>

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

export default ChangePassword;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    headerContainer: {
        marginTop: hp(7),
        marginHorizontal: wp(4),
        marginBottom: hp(3),
        flexDirection: "row",
        alignItems: 'center',
    },
    backButton: {
        marginRight: wp(2),
    },
    header: {
        fontSize: wp(5),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
    },
    inputContainer: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(1),
        height: hp(6),
        borderColor: COLORS.Midgray,
        borderWidth: 0.5,
        borderRadius: wp(2),
        paddingLeft: wp(2),
    },
    label: {
        fontSize: hp(1.8),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
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
        marginVertical: hp(3)
    }
});
