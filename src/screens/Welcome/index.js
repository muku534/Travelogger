import React from 'react';
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from '../../components/Pixel/Index';
import { COLORS, Images } from '../../../constants';
import fontFamily from '../../../constants/fontFamily';
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet();

const WelcomeScreen = ({ navigation }) => {
    const iconTranslate = useSharedValue(0);
    const maxSwipeDistance = isTablet ? wp(59.5) : wp(50);
    const swipeThreshold = wp(20);

    const resetIconPosition = () => {
        iconTranslate.value = withTiming(0, { duration: 300 });
    };

    const swipeGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (event.translationX >= 0 && event.translationX <= maxSwipeDistance) {
                iconTranslate.value = event.translationX;
            }
        })
        .onEnd((event) => {
            if (event.translationX > swipeThreshold) {
                iconTranslate.value = withTiming(maxSwipeDistance, { duration: 300 }, () => {
                    runOnJS(navigation.navigate)('SocialAuth');
                    runOnJS(resetIconPosition)();
                });
            } else {
                runOnJS(resetIconPosition)();
            }
        });

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <GestureHandlerRootView style={{ flex: 1 }}>
                {/* Ensuring the background image fully covers the screen */}
                <View style={{ flex: 1 }}>
                    <ImageBackground
                        source={Images.bgImage}
                        style={styles.background}
                        resizeMode="cover"
                    >
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>Plan Your Dream Trip Your Way: Manually Or AI!</Text>
                            <Text style={styles.subtitle}>
                                Customize your perfect travel experience with flexible manual or AI planning.
                            </Text>
                        </View>
                    </ImageBackground>
                </View>

                {/* Get Started Button with Swipe Gesture */}
                <TouchableOpacity style={styles.button} activeOpacity={0.8}>
                    <GestureDetector gesture={swipeGesture}>
                        <View style={styles.buttonContent}>
                            {/* Animated Icon: Only the icon will move */}
                            <Animated.View
                                style={[styles.iconContainer, { transform: [{ translateX: iconTranslate }] }]}>
                                <MaterialCommunityIcons name="chevron-triple-right" size={isTablet ? hp(3) : hp(3.5)} color={COLORS.white} />
                            </Animated.View>

                            {/* Static Button Text: Text stays in place */}
                            <Text style={styles.buttonText}>Get Started</Text>
                        </View>
                    </GestureDetector>
                </TouchableOpacity>

            </GestureHandlerRootView>
        </View>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    background: {
        ...StyleSheet.absoluteFillObject, // Ensures it takes up the full screen
    },
    textContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: wp(5),
        paddingBottom: hp(17),
    },
    title: {
        fontSize: isTablet ? wp(2.5) : wp(6),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.white,
        textAlign: 'center',
        padding: hp(1.5),
    },
    subtitle: {
        fontSize: isTablet ? wp(2) : wp(4),
        color: COLORS.white,
        textAlign: 'center',
        opacity: 0.9,
    },
    button: {
        position: 'absolute',
        bottom: hp(6),
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: COLORS.white,
        borderWidth: 1.5,
        paddingVertical: hp(0.2),
        paddingHorizontal: wp(1),
        width: wp(65),
        borderRadius: wp(10),
        alignItems: 'center',
        overflow: 'hidden',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: isTablet ? wp(2.5) : wp(4.5),
        paddingHorizontal: isTablet ? wp(22) : wp(8),
        fontFamily: fontFamily.FONTS.Medium,
        color: COLORS.white,
        marginRight: wp(2),
        zIndex: 0,
    },
    iconContainer: {
        backgroundColor: COLORS.Midgray,
        padding: isTablet ? wp(1) : wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: hp(10),
        overflow: 'hidden',
        zIndex: 1
    },
});
