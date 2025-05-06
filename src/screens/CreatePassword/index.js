import React, { useState } from 'react';
import {
    Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text,
    TouchableOpacity, View, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback,
    Alert
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS, fontFamily, SVGS } from "../../../constants";
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../services/authService';
import { UPDATE_PROFILE } from '../../redux/Actions';
import logger from '../../utils/logger';
import { storeDataInAsyncStorage } from '../../utils/Helper';
import Toast from 'react-native-toast-message';
import DeviceInfo from 'react-native-device-info';
import CommonHeader from '../../components/CommonHeader';

const isTablet = DeviceInfo.isTablet();

const EditProfile = ({ navigation }) => {
    const dispatch = useDispatch()
    const userData = useSelector(state => state.userData);
    const [loading, setloading] = useState(false)

    // State management for input fields
    const [formData, setFormData] = useState({
        name: userData?.name || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        location: userData?.location || '',
        website: userData?.website || '',
        languages: userData?.languages?.join(', ') || '',
        bio: userData?.bio || '',
        instagram: userData?.socialMedia?.instagram || '',
        facebook: userData?.socialMedia?.facebook || '',
        twitter: userData?.socialMedia?.twitter || '',
        linkedin: userData?.socialMedia?.linkedin || '',
        youtube: userData?.socialMedia?.youtube || '',
    });

    // Function to handle input changes
    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    // Function to dismiss keyboard
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const handleSaveChanges = async () => {
        setloading(true);
        try {
            const normalizeUrl = (url) => {
                if (!url) return "";
                return !/^https?:\/\//i.test(url) ? `https://${url}` : url;
            };

            const updatedData = {
                ...formData,
                website: normalizeUrl(formData.website),
                languages: formData.languages
                    ? formData.languages.split(',').map(lang => lang.trim()) // Convert string to array
                    : [], // Ensure it's an empty array if empty
                socialMedia: {
                    instagram: normalizeUrl(formData.instagram),
                    facebook: normalizeUrl(formData.facebook),
                    twitter: normalizeUrl(formData.twitter),
                    linkedin: normalizeUrl(formData.linkedin),
                    youtube: normalizeUrl(formData.youtube),
                }
            };

            const response = await updateProfile(userData.userId, updatedData);

            const newUserData = {
                ...userData,
                ...response,
                socialMedia: response.socialMedia || {}  // Ensure socialMedia is updated
            };

            dispatch({
                type: UPDATE_PROFILE,
                payload: { updatedData: newUserData },
            });

            await storeDataInAsyncStorage("userData", newUserData);
            Toast.show({
                type: 'success',
                text1: 'Profile Updated',
                text2: 'Your profile has been updated successfully.',
                position: 'top'
            });

            navigation.goBack();

        } catch (error) {
            logger.error("Update Profile Error:", error);
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: 'Something went wrong. Please try again.',
                position: 'top'
            });
        } finally {
            setloading(false);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(5) }}>
                        <CommonHeader title="Edit Profile" navigation={navigation} />
                        <View style={styles.container}>

                            {/* Profile Image */}
                            <View style={styles.profileContainer}>
                                <Image source={{ uri: userData?.avatarImgUrl.replace("/svg?", "/png?") }} style={styles.avatar} />
                            </View>

                            {/* Input Fields */}
                            <View style={styles.inputContainer}>
                                {Object.entries({
                                    name: "Full Name",
                                    email: "Email",
                                    phone: "Phone Number",
                                    location: "Address",
                                    website: "Website",
                                    languages: "Languages",
                                    bio: "Bio",
                                }).map(([key, label]) => (
                                    <View key={key}>
                                        <Text style={styles.label}>{label}</Text>
                                        <TextInput
                                            style={[styles.input, key === "bio" && styles.textArea]}
                                            placeholder={`Enter your ${label.toLowerCase()}`}
                                            placeholderTextColor={COLORS.Midgray}
                                            value={formData[key]}
                                            onChangeText={text => handleChange(key, text)}
                                            multiline={key === "bio"}
                                            numberOfLines={key === "bio" ? 4 : 1}
                                            keyboardType={key === "phone" ? "phone-pad" : "default"}
                                        />
                                    </View>
                                ))}
                            </View>

                            {/* Social Media Links */}
                            <Text style={styles.sectionTitle}>Social Media Links</Text>
                            <View style={styles.inputContainer}>
                                {Object.entries({
                                    instagram: { label: "Instagram", icon: SVGS.INSTAGRAM },
                                    facebook: { label: "Facebook", icon: SVGS.FACEBOOKICON },
                                    twitter: { label: "X", icon: SVGS.TWITTER },
                                    linkedin: { label: "LinkedIn", icon: SVGS.LINKEDIN },
                                    youtube: { label: "YouTube", icon: SVGS.YOUTUBEICON },
                                }).map(([key, { label, icon }]) => (
                                    <View key={key}>
                                        <View style={styles.socialRow}>
                                            {icon && React.createElement(icon, { width: isTablet ? wp(2) : wp(5), height: isTablet ? wp(2) : wp(5) })}
                                            <Text style={styles.socialRowLabel}>{label}</Text>
                                        </View>

                                        <TextInput
                                            style={styles.input}
                                            placeholder={`Enter ${label} profile link`}
                                            placeholderTextColor={COLORS.Midgray}
                                            value={formData[key]}
                                            onChangeText={text => handleChange(key, text)}
                                        />
                                    </View>
                                ))}
                            </View>

                            {/* Save Button */}
                            <Button
                                title="Save Changes"
                                disabled={loading}
                                loading={loading}
                                onPress={handleSaveChanges}
                            />

                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: hp(5),
        paddingHorizontal: wp(5),
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp(2),
    },
    headerTitle: {
        fontSize: wp(5),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
        marginLeft: wp(3),
    },
    profileContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(2.5),
    },
    avatar: {
        width: hp(15),
        height: hp(15),
        borderRadius: hp(15),
    },
    label: {
        fontSize: isTablet ? wp(2) : wp(4),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray,
        marginBottom: hp(0.5),
    },
    input: {
        height: hp(5.5),
        borderWidth: 0.5,
        borderColor: COLORS.Midgray,
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.Medium,
        borderRadius: hp(1),
        paddingHorizontal: wp(3),
        fontSize: isTablet ? wp(1.5) : wp(4),
        marginBottom: hp(2),
    },
    textArea: {
        height: hp(10),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.Medium,
        textAlignVertical: "top",
    },
    sectionTitle: {
        fontSize: isTablet ? wp(2.5) : wp(4.5),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
        marginBottom: hp(1),
        marginTop: hp(1),
    },
    socialRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(0.5),
    },
    socialRowLabel: {
        fontSize: isTablet ? wp(2) : wp(4),
        paddingHorizontal: wp(1),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray,
        marginBottom: hp(0.5),
    },
    saveButton: {
        marginBottom: hp(4),
    },
});
