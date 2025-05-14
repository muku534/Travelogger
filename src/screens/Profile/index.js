import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, StatusBar, ScrollView, Alert, Linking, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel/Index';
import { COLORS, SVGS } from '../../../constants';
import fontFamily from '../../../constants/fontFamily';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAccount, getProfile } from '../../services/authService';
import { FETCH_PROFILE, LOGOUT } from '../../redux/Actions';
import logger from '../../utils/logger';
import { storeDataInAsyncStorage } from '../../utils/Helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from "react-native-toast-message";
import AndroidOpenSettings from 'react-native-android-open-settings'

const Profile = ({ navigation }) => {
    const dispatch = useDispatch();
    const userData = useSelector(state => state.userData);
    const isGuest = !userData || Object.keys(userData).length === 0;

    const openSocialLink = (url) => {
        if (url) {
            Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
        } else {
            Toast.show({
                type: "error",
                text1: "Invalid URL",
                text2: "The social media link is not available.",
            });
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await getProfile(userData.userId);

                if (profileData) {
                    dispatch({
                        type: FETCH_PROFILE,
                        payload: { userData: profileData },
                    });
                    await storeDataInAsyncStorage("userData", profileData)
                } else {
                    logger.error("Invalid Profile Data:", profileData);
                }
            } catch (error) {
                logger.error("Profile Fetch Error:", error);
            }
        };

        fetchProfile();
    }, []);

    // Function to Handle Navigation
    const handleNavigation = (screen, params = {}) => {
        if (screen) {
            navigation.navigate(screen, params);
        }
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteAccount(userData?.userId); // Call API to delete user
                            await AsyncStorage.removeItem('userData'); // Clear stored user data

                            Toast.show({
                                type: "success",
                                text1: "Account Deleted",
                                text2: "Your account has been successfully deleted.",
                            });

                            navigation.reset({ index: 0, routes: [{ name: 'SocialAuth' }] }); // Navigate to Login
                        } catch (error) {
                            logger.error("Delete Account Error:", error);
                            Toast.show({
                                type: "error",
                                text1: "Deletion Failed",
                                text2: "Unable to delete account. Please try again.",
                            });
                        }
                    },
                },
            ]
        );
    };

    const openNotificationSettings = async () => {
        if (Platform.OS === 'ios') {
            const url = 'app-settings:';
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert("Error", "Unable to open settings");
            }
        } else if (Platform.OS === 'android') {
            AndroidOpenSettings.appNotificationSettings();
        } else {
            Alert.alert("Unsupported platform", "This action is not supported on your device.");
        }
    };
    


    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userData'); // Clear stored user data
            dispatch({ type: LOGOUT });
            navigation.reset({ index: 0, routes: [{ name: 'SocialAuth' }] }); // Navigate to Login
        } catch (error) {
            logger.error("Logout Error:", error);
        }
    };


    // Menu Items with Navigation Screens
    const menuItems = [
        { label: 'Edit Profile', icon: <SVGS.EDIT_PROFILE width={hp(3.3)} height={hp(3)} />, screen: 'EditProfile' },
        { label: 'Change Password', icon: <SVGS.PASSWORD width={hp(3.3)} height={hp(3)} />, action: () => handleNavigation('ForgotPassword', { screenType: 'changePassword' }) },
        { label: 'Notification Settings', icon: <SVGS.NOTIFICATION width={hp(3.3)} height={hp(3)} />, action: openNotificationSettings },
        { label: 'Privacy Policy', icon: <SVGS.PRIVACY width={hp(3.3)} height={hp(3)} />, screen: 'Privacy' },
        { label: 'Terms and Conditions', icon: <SVGS.TERMS width={hp(3.3)} height={hp(3)} />, screen: 'Terms' },
        { label: 'Contact Us', icon: <SVGS.CONTACT width={hp(3.3)} height={hp(3)} />, screen: 'ContactUs' },
        { label: 'Delete Account', icon: <SVGS.DELETE_ACCOUNT width={hp(3.3)} height={hp(3)} />, action: handleDeleteAccount },
        { label: 'Logout', icon: <SVGS.LOGOUT width={hp(3.3)} height={hp(3)} />, action: handleLogout },
    ];

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            {isGuest ? (
            <View style={styles.guestContainer}>
                <Text style={styles.guestTitle}>You're browsing as a guest</Text>
                <Text style={styles.guestSubtitle}>Log in to unlock more features.</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('SocialAuth')}
                    style={styles.loginButton}
                >
                    <Text style={styles.loginButtonText}>Log In</Text>
                </TouchableOpacity>
            </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(13) }}>
                    <View style={styles.container}>
                        {/* Header Section */}
                        <View style={styles.header} />

                        {/* Profile Info */}
                        <View style={styles.profileContainer}>
                            {/* <Image source={{ uri: userData?.avatarImgUrl }} style={styles.avatar} /> */}
                            <Image source={{ uri: userData?.avatarImgUrl.replace("/svg?", "/png?") }} style={styles.avatar} />
                            <Text style={styles.name}>{userData?.name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <SVGS.EMAIL width={hp(2.3)} height={hp(2.3)} />
                                <Text style={styles.email}>{userData?.email}</Text>
                            </View>

                            {/* Display Bio if Available */}
                            {userData?.bio && userData.bio.trim().length > 0 && (
                                <Text style={styles.bio} numberOfLines={1}>{userData.bio}</Text>
                            )}

                            {/* Social Icons */}
                            <View style={styles.socialIcons}>
                                {userData?.socialMedia?.youtube && (
                                    <TouchableOpacity
                                        style={styles.socialIcon}
                                        onPress={() => openSocialLink(userData.socialMedia.youtube)}
                                    >
                                        <SVGS.YOUTUBE width={hp(3.8)} height={hp(3.8)} />
                                    </TouchableOpacity>
                                )}

                                {userData?.socialMedia?.facebook && (
                                    <TouchableOpacity
                                        style={styles.socialIcon}
                                        onPress={() => openSocialLink(userData.socialMedia.facebook)}
                                    >
                                        <SVGS.FACEBOOK width={hp(3.8)} height={hp(3.8)} />
                                    </TouchableOpacity>
                                )}

                                {userData?.socialMedia?.instagram && (
                                    <TouchableOpacity
                                        style={styles.socialIcon}
                                        onPress={() => openSocialLink(userData.socialMedia.instagram)}
                                    >
                                        <SVGS.INSTAGRAMICON width={hp(4.2)} height={hp(4.2)} />
                                    </TouchableOpacity>
                                )}

                                {userData?.socialMedia?.linkedin && (
                                    <TouchableOpacity
                                        style={styles.socialIcon}
                                        onPress={() => openSocialLink(userData.socialMedia.linkedin)}
                                    >
                                        <SVGS.LINKEDINICON width={hp(3.8)} height={hp(3.8)} />
                                    </TouchableOpacity>
                                )}

                                {userData?.socialMedia?.twitter && (
                                    <TouchableOpacity
                                        style={styles.socialIcon}
                                        onPress={() => openSocialLink(userData.socialMedia.twitter)}
                                    >
                                        <SVGS.TWITTERICON width={hp(3.8)} height={hp(3.8)} />
                                    </TouchableOpacity>
                                )}

                                {userData?.website && (
                                    <TouchableOpacity
                                        style={styles.socialIcon}
                                        onPress={() => openSocialLink(userData.website)}
                                    >
                                        <SVGS.WORLDICON width={hp(3.8)} height={hp(3.8)} />
                                    </TouchableOpacity>
                                )}

                            </View>

                        </View>

                        {/* Menu List */}
                        <View style={styles.menuContainer}>
                            {menuItems.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.menuItem}
                                    onPress={() => item.action ? item.action() : handleNavigation(item.screen)}
                                >
                                    <View style={styles.menuLeft}>
                                        {item.icon}
                                        <Text style={styles.menuText}>{item.label}</Text>
                                    </View>
                                    {/* Conditionally render chevron for logout */}
                                    {item.label !== 'Logout' && (
                                        <Ionicons name="chevron-forward" size={hp(2.5)} color={COLORS.darkgray1} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Version */}
                        <Text style={styles.version}>Version 0.0.1</Text>
                    </View>
                </ScrollView>
            )}
        </View>
    );
};



const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    header: { height: Platform.OS === 'ios' ? hp(18) : hp(16), backgroundColor: '#FFEAEA' },
    bio: {
        fontSize: hp(1.9),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.Medium,
        textAlign: 'center',
        marginVertical: hp(0.5),
        marginHorizontal: wp(5),
    },
    profileContainer: { alignItems: 'center', marginTop: Platform.OS === 'ios' ? -hp(8): -hp(7) },
    avatar: { width: hp(15), height: hp(15), borderRadius: hp(15) },
    name: { fontSize: hp(2.5), color: COLORS.darkgray, fontFamily: fontFamily.FONTS.bold, marginTop: hp(1) },
    email: { fontSize: hp(1.8), color: COLORS.darkgray, marginHorizontal: hp(0.5) },
    socialIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(1),
        marginHorizontal: wp(2),
    },
    socialIcon: {
        borderRadius: hp(4),
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: wp(1),
    },
    menuContainer: { marginTop: hp(1), paddingHorizontal: wp(5) },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: hp(1.4),
    },
    menuLeft: { flexDirection: 'row', alignItems: 'center' },
    menuText: { fontSize: hp(2), marginLeft: wp(3), color: COLORS.darkgray, fontFamily: fontFamily.FONTS.Medium },
    version: { textAlign: 'center', color: COLORS.darkgray1, marginTop: hp(1.8), fontSize: hp(1.7) },
    guestContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(10),
    },
    guestTitle: {
        fontSize: hp(2.5),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
        marginBottom: hp(1),
        textAlign: 'center',
    },
    guestSubtitle: {
        fontSize: hp(2),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray1,
        textAlign: 'center',
        marginBottom: hp(4),
    },
    loginButton: {
        backgroundColor: COLORS.red,
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(10),
        borderRadius: wp(2),
    },
    loginButtonText: {
        color: COLORS.white,
        fontSize: hp(2),
        fontFamily: fontFamily.FONTS.Medium,
    },
    
});

export default Profile;
