import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS } from "../../../constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import Button from '../../components/Button';
import fontFamily from '../../../constants/fontFamily';

const ChangePassword = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdatePassword = () => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log("Password Updated Successfully");
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={wp(6)} color="black" />
                </TouchableOpacity>
                <Text style={styles.header}>Change Password</Text>
            </View>
            <View style={{ paddingHorizontal: wp(5), alignItems: 'center', }}>
                {/* Input Fields */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Current Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter here"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />

                    <Text style={styles.label}>New Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter here"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />

                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter here"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                {/* Update Password Button */}
                <Button
                    title="Update Password"
                    color={COLORS.red}
                    onPress={handleUpdatePassword}
                    style={styles.button}
                />
            </View>
        </SafeAreaView>
    );
};

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
        alignItems:'center'
    },
    backButton: {
        marginRight: wp(2), // Add spacing from title
    },
    header: {
        fontSize: wp(5),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.bold,
    },
    inputContainer: {
        width: "100%",
        marginBottom: hp(0.5),
    },
    label: {
        fontSize: wp(4),
        fontWeight: "500",
        color: COLORS.black,
        marginBottom: hp(1),
    },
    input: {
        width: "100%",
        height: hp(6),
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: wp(2),
        paddingHorizontal: wp(4),
        fontSize: wp(4),
        marginBottom: hp(2),
    },
});
