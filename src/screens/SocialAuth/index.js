import React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel/Index';
import { COLORS } from '../../../constants';
import fontFamily from '../../../constants/fontFamily';

const SocialAuth = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    {/* Background Image */}
                    <ImageBackground
                        source={require('../../../assets/images/authentication_Image.png')}
                        style={styles.backgroundImage}
                    />

                    {/* Logo */}
                    <View style={styles.contentContainer}>
                        <Image
                            source={require('../../../assets/images/travelogger_logo.png')}
                            style={styles.logo}
                        />

                        {/* Google Signup Button */}
                        <TouchableOpacity
                            style={styles.signupButton}
                            onPress={() => console.log("Signup with Google")}
                        >
                            <Image
                                source={require('../../../assets/icons/google.png')}
                                style={styles.icon}
                            />
                            <Text style={styles.buttonText}>Signup with Google</Text>
                        </TouchableOpacity>

                        {/* Gmail Signup Button */}
                        <TouchableOpacity
                            style={styles.signupButton}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Image
                                source={require('../../../assets/icons/Gmail.png')}
                                style={styles.icon}
                            />
                            <Text style={styles.buttonText}>Signup with Gmail</Text>
                        </TouchableOpacity>

                        {/* Sign In Option */}
                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginVertical: hp(2) }}>
                            <Text style={styles.signInText}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
                                <Text style={styles.signInBold}> Sign In</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
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
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.white,
        width: wp(100),
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
        marginBottom: hp(2),
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
    signInText: {
        marginVertical: hp(2),
        fontSize: hp(2),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.Medium
    },
    signInBold: {
        fontSize: hp(2),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
    },
});
