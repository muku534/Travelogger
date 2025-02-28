import {
    Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text,
    TouchableOpacity, View, TextInput
} from 'react-native';
import React from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../components/Pixel/Index";
import { COLORS } from "../../../constants";
import Button from '../../components/Button';
import fontFamily from '../../../constants/fontFamily';
import InstagramIcon from '../../../assets/icons/instagram_icon.svg';
import FacebookIcon from '../../../assets/icons/Facebook_icon.svg';
import TwitterIcon from '../../../assets/icons/X_icon.svg';
import LinkedInIcon from '../../../assets/icons/LinkedIn_ICON.svg';
import YouTubeIcon from '../../../assets/icons/Youtube_ICON.svg';

const EditProfile = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={wp(6)} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Edit Profile</Text>
                    </View>

                    {/* Profile Image Container */}
                    <View style={styles.profileContainer}>
                        <Image source={require('../../../assets/images/avatar1.png')} style={styles.avatar} />
                    </View>

                    {/* Input Fields */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput style={styles.input} placeholder="Enter your name" placeholderTextColor="#aaa" />

                        <Text style={styles.label}>Email</Text>
                        <TextInput style={styles.input} placeholder="Enter your email" keyboardType="email-address" placeholderTextColor="#aaa" />

                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput style={styles.input} placeholder="Enter your phone number" keyboardType="phone-pad" placeholderTextColor="#aaa" />

                        <Text style={styles.label}>Location</Text>
                        <TextInput style={styles.input} placeholder="Enter your location" placeholderTextColor="#aaa" />

                        <Text style={styles.label}>Website</Text>
                        <TextInput style={styles.input} placeholder="Enter your website" keyboardType="url" placeholderTextColor="#aaa" />

                        <Text style={styles.label}>Languages</Text>
                        <TextInput style={styles.input} placeholder="Enter languages you speak" placeholderTextColor="#aaa" />

                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Write a short bio about yourself..."
                            multiline
                            numberOfLines={4}
                            placeholderTextColor="#aaa"
                        />
                    </View>

                    {/* Social Media Links */}
                    <Text style={styles.sectionTitle}>Social Media Links</Text>
                    <View style={styles.inputContainer}>
                        {/* Instagram */}
                        <View style={styles.socialRow}>
                            <InstagramIcon width={wp(5)} height={wp(5)} />
                            <Text style={styles.socialRowlabel}>Instagram</Text>
                        </View>
                        <TextInput style={styles.input} placeholder="Enter Instagram profile link" placeholderTextColor="#aaa" />

                        {/* Facebook */}
                        <View style={styles.socialRow}>
                            <FacebookIcon width={wp(5)} height={wp(5)} />
                            <Text style={styles.socialRowlabel}>Facebook</Text>
                        </View>
                        <TextInput style={styles.input} placeholder="Enter Facebook profile link" placeholderTextColor="#aaa" />

                        {/* Twitter (X) */}
                        <View style={styles.socialRow}>
                            <TwitterIcon width={wp(5)} height={wp(5)} />
                            <Text style={styles.socialRowlabel}>X</Text>
                        </View>
                        <TextInput style={styles.input} placeholder="Enter Twitter profile link" placeholderTextColor="#aaa" />

                        {/* LinkedIn */}
                        <View style={styles.socialRow}>
                            <LinkedInIcon width={wp(5)} height={wp(5)} />
                            <Text style={styles.socialRowlabel}>LinkedIn</Text>
                        </View>
                        <TextInput style={styles.input} placeholder="Enter LinkedIn profile link" placeholderTextColor="#aaa" />

                        {/* YouTube */}
                        <View style={styles.socialRow}>
                            <YouTubeIcon width={wp(5)} height={wp(5)} />
                            <Text style={styles.socialRowlabel}>YouTube</Text>
                        </View>
                        <TextInput style={styles.input} placeholder="Enter YouTube channel link" placeholderTextColor="#aaa" />
                    </View>

                    <Button
                        title="Save Changes"
                        color={COLORS.red}
                        onPress={() => navigation.navigate("Profile")}
                        style={styles.saveButton}
                    />

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

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
    editIcon: {
        position: "absolute",
        bottom: 5,
        right: 5,
        backgroundColor: COLORS.primary,
        padding: hp(1),
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    socialRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(0.5),
    },
    socialRowlabel: {
        fontSize: wp(4),
        paddingHorizontal: wp(1),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray,
        marginBottom: hp(0.5),
    },
    label: {
        fontSize: wp(4),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray,
        marginBottom: hp(0.5),
    },
    input: {
        height: hp(5.5),
        borderWidth: 0.5,
        borderColor: COLORS.Midgray,
        borderRadius: hp(1),
        paddingHorizontal: wp(3),
        fontSize: wp(4),
        marginBottom: hp(2),
    },
    textArea: {
        height: hp(10),
        textAlignVertical: "top",
    },
    sectionTitle: {
        fontSize: wp(4.5),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
        marginBottom: hp(1),
        marginTop: hp(1),
    },
    saveButton: {
        marginBottom: hp(4),
    },
});
