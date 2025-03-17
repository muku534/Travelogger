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

const SocialAuth = ({ navigation }) => {
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets(); // Get safe area insets for iOS

    useEffect(() => {
        if (Platform.OS === 'android') {
            StatusBar.setTranslucent(true);
            StatusBar.setBackgroundColor('transparent');
        }
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ScrollView showsVerticalScrollIndicator={false}>
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
        width: wp(52),
        height: hp(15),
        resizeMode: 'contain',
    },
    signupButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp(90),
        height: hp(7),
        borderRadius: wp(10),
        marginVertical: hp(3),
        backgroundColor: COLORS.white,
        borderColor: COLORS.gray,
        borderWidth: 0.5,
        paddingHorizontal: wp(5),
    },
    icon: {
        width: wp(7.5),
        height: wp(7.5),
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
        marginTop: hp(8),
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
});
