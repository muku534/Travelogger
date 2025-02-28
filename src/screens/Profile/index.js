import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel/Index';
import { COLORS } from '../../../constants';
import EditProfile from '../../../assets/icons/Edit_Profile.svg';
import Email from '../../../assets/icons/email.svg';
import Password from '../../../assets/icons/Changepassword_icon.svg';
import Notification from '../../../assets/icons/Notification_Settings.svg';
import Privacy from '../../../assets/icons/Privacy_policy.svg';
import Terms from '../../../assets/icons/Terms.svg';
import Contact from '../../../assets/icons/Contact.svg';
import Youtube from '../../../assets/icons/youtube_icon_active.svg';
import Facebook from '../../../assets/icons/facebook_icon_active.svg';
import Delete from '../../../assets/icons/delete_icon.svg';
import Logout from '../../../assets/icons/logout_icon.svg';
import fontFamily from '../../../constants/fontFamily';

const Profile = ({ navigation }) => {
    // Function to Handle Navigation
    const handleNavigation = (screen) => {
        if (screen) {
            navigation.navigate(screen);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(13) }}>
                <View style={styles.container}>
                    {/* Header Section */}
                    <View style={styles.header} />

                    {/* Profile Info */}
                    <View style={styles.profileContainer}>
                        <Image source={require('../../../assets/images/avatar1.png')} style={styles.avatar} />
                        <Text style={styles.name}>Yeswanth</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Email width={hp(2.3)} height={hp(2.3)} />
                            <Text style={styles.email}>ui@colourmoon.com</Text>
                        </View>

                        {/* Social Icons */}
                        <View style={styles.socialIcons}>
                            <TouchableOpacity style={[styles.socialIcon, styles.youtubeIcon]}>
                                <Youtube width={hp(4)} height={hp(4)} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialIcon, styles.facebookIcon]}>
                                <Facebook width={hp(4)} height={hp(4)} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Menu List */}
                    <View style={styles.menuContainer}>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.menuItem}
                                onPress={() => handleNavigation(item.screen)}
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
        </SafeAreaView>
    );
};

// Menu Items with Navigation Screens
const menuItems = [
    { label: 'Edit Profile', icon: <EditProfile width={hp(3.3)} height={hp(3)} />, screen: 'EditProfile' },
    { label: 'Change Password', icon: <Password width={hp(3.3)} height={hp(3)} />, screen: 'ChangePassword' },
    { label: 'Notification Settings', icon: <Notification width={hp(3.3)} height={hp(3)} />, screen: '' },
    { label: 'Privacy Policy', icon: <Privacy width={hp(3.3)} height={hp(3)} />, screen: 'Privacy' },
    { label: 'Terms and Conditions', icon: <Terms width={hp(3.3)} height={hp(3)} />, screen: 'Terms' },
    { label: 'Contact Us', icon: <Contact width={hp(3.3)} height={hp(3)} />, screen: '' },
    { label: 'Delete Account', icon: <Delete width={hp(3.3)} height={hp(3)} />, screen: '' },
    { label: 'Logout', icon: <Logout width={hp(3.3)} height={hp(3)} />, screen: '' },
];

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    header: { height: hp(16), backgroundColor: '#FFEAEA' },
    profileContainer: { alignItems: 'center', marginTop: -hp(7) },
    avatar: { width: hp(15), height: hp(15), borderRadius: hp(15) },
    name: { fontSize: hp(2.5), color: COLORS.darkgray, fontFamily: fontFamily.FONTS.bold, marginTop: hp(1) },
    email: { fontSize: hp(1.8), color: COLORS.darkgray, marginHorizontal: hp(0.5) },
    socialIcons: {
        flexDirection: 'row',
        marginTop: hp(1),
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialIcon: {
        width: hp(4), // Ensures circular shape
        height: hp(4),
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
});

export default Profile;
