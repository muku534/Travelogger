import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../Pixel/Index";
import { COLORS, fontFamily, SVGS } from '../../../constants';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import LoadingAnimation from '../LoadingAnimation';

const LoadingScreen = () => {
    // const navigation = useNavigation();
    // useEffect(() => {
    //     // Navigate to AiPlanTripDetails after 1 second
    //     const timer = setTimeout(() => {
    //         navigation.replace('AiPlanTripDetails'); // Use replace to prevent going back
    //     }, 1000);

    //     return () => clearTimeout(timer); // Cleanup on unmount
    // }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={styles.container}>
                <StatusBar backgroundColor={COLORS.white} barStyle={'dark-content'} />

                <LoadingAnimation />

                {/* Title and Subtitle */}
                <View style={{ marginTop: hp(3) }}>
                    <Text style={styles.title}>Creating Your Dream Itinerary</Text>
                    <Text style={styles.subtitle}>Our AI is generating the best plan for you</Text>

                    {/* Loading Steps */}
                    <View style={styles.stepsContainer}>
                        <LoadingStep IconComponent={SVGS.SHARESTEP} text="Finding the Best Locations..." />
                        <LoadingStep IconComponent={SVGS.SUIT} text="Selecting the Preferred Accommodations..." />
                        <LoadingStep IconComponent={SVGS.MAGIC} text="Gathering Destination Photos..." />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

// Step Component using SVGs
const LoadingStep = ({ IconComponent, text }) => (
    <View style={styles.step}>
        <LinearGradient
            colors={[COLORS.RoyalBlueViolet, COLORS.DeepTeal]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ borderRadius: wp(2), padding: wp(1) }}
        >
            <IconComponent width={hp(2)} height={hp(2.2)} />
        </LinearGradient>
        <Text style={styles.stepText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    title: {
        fontSize: hp(2.5),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: hp(1.9),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.Midgray,
        textAlign: 'center',
        marginTop: hp(1),
    },
    stepsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(3),
        paddingHorizontal: wp(4),
        width: wp(89),
    },
    step: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(2),
    },
    stepText: {
        flex: 1,
        fontSize: hp(1.6),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.darkgray,
        marginLeft: wp(2),
    },
});

export default LoadingScreen;
