import React, { useEffect } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Platform } from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel/Index';
import { COLORS, ICONS, Images } from '../../../constants';
import fontFamily from '../../../constants/fontFamily';
import { useDispatch } from 'react-redux';
import { signInWithGoogle } from '../../services/googleAuthService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import appleAuth from '@invertase/react-native-apple-authentication';
import { signInWithApple } from '../../services/appleAuthService';

const isTablet = DeviceInfo.isTablet();

const SocialAuth = ({ navigation }) => {
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets(); // Get safe area insets for iOS

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(5) }}>
                <View style={[styles.container, { paddingTop: insets.top }]}>
                    {/* Background Image */}
                    <ImageBackground
                        source={Images.authenticationImage}
                        style={styles.backgroundImage}
                    />

                    {/* Logo */}
                    <View style={styles.contentContainer}>
                        <Image
                            source={Images.travelLoggerLogo}
                            style={styles.logo}
                        />

                        {/* Google Signup Button */}
                        <TouchableOpacity
                            style={styles.signupButton}
                            onPress={() => signInWithGoogle(navigation, dispatch)}
                        >
                            <Image
                                source={ICONS.GOOGLE}
                                style={styles.icon}
                            />
                            <Text style={styles.buttonText}>Signup with Google</Text>
                        </TouchableOpacity>
                        {/* {Platform.OS === 'ios' && appleAuth.isSupported && (
                            // Apple Signup Button */}
                        <TouchableOpacity
                            style={styles.signupButton}
                            onPress={() => signInWithApple(navigation, dispatch)}
                        >
                            <Image
                                source={ICONS.APPLE}
                                style={styles.icon}
                            />
                            <Text style={styles.buttonText}>Signup with Apple</Text>
                        </TouchableOpacity>
                        {/* )} */}

                        {/* Guest Access Option */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('TabStack')} // or your main/home screen name
                            activeOpacity={0.8}
                            style={styles.guestButton}
                        >
                            <Text style={styles.guestText}>Continue as Guest</Text>
                        </TouchableOpacity>


                        {/* Sign In Option */}
                        <View style={styles.signInContainer}>
                            <Text style={styles.signInText}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
                                <Text style={styles.signInBold}> Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default SocialAuth;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        width: '100%',
        height: hp(55),
        position: 'absolute', // Ensures image fills background
        top: 0,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.white,
        width: wp(100),
        marginTop: hp(50)
    },
    logo: {
        width: isTablet ? wp(15) : wp(52),
        height: isTablet ? hp(8) : Platform.OS === 'ios' ? hp(8) : hp(10),
        resizeMode: 'contain',
    },
    signupButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: isTablet ? wp(40) : wp(90),
        height: hp(7),
        borderRadius: isTablet ? wp(2) : wp(10),
        marginVertical: Platform.OS === 'ios' ? hp(1) : hp(1),
        backgroundColor: COLORS.white,
        borderColor: COLORS.gray,
        borderWidth: 0.5,
        paddingHorizontal: wp(5),
    },
    icon: {
        width: isTablet ? wp(2.5) : wp(7.5),
        height: isTablet ? wp(2.5) : wp(7.5),
        resizeMode: 'contain',
    },
    buttonText: {
        flex: 1, // Pushes text to center
        textAlign: 'center', // Centers text
        fontSize: hp(1.9),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray,
        alignSelf: 'center', // Ensures vertical centering
    },
    signInContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Platform.OS === 'ios' ? hp(2.5) : hp(3.5),
    },
    signInText: {
        fontSize: hp(2),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.Medium,
    },
    signInBold: {
        fontSize: hp(2),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
    },
    guestButton: {
        marginTop: hp(3),
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(8),
        borderRadius: wp(2),
        backgroundColor: COLORS.gray, // or any other subtle background
    },
    guestText: {
        fontSize: hp(2),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray,
        textAlign: 'center',
    },

});
