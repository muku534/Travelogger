import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from './Pixel/Index';
import COLORS from '../../constants/colors';

const LoadingAnimation = () => {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const rotateInterpolate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            {/* Outer Static Circle */}
            <View style={styles.outerRing} />

            {/* Animated Inner Ring */}
            <Animated.View
                style={[
                    styles.innerRing,
                    { transform: [{ rotate: rotateInterpolate }] },
                ]}
            />

            {/* Plane Icon */}
            <View style={styles.iconContainer}>
                <Svg width={wp(14)} height={wp(14)} viewBox="0 0 24 24" fill="none" stroke="#5100E6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                </Svg>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: wp(32),
        height: wp(32),
        justifyContent: 'center',
        alignItems: 'center',
    },
    outerRing: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: wp(20),
        borderWidth: wp(2),
        borderColor: COLORS.Lavender,
    },
    innerRing: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: wp(20),
        borderWidth: wp(2),
        borderTopColor: 'transparent',
        borderRightColor: COLORS.RoyalBlueViolet,
        borderBottomColor: COLORS.RoyalBlueViolet,
        borderLeftColor: COLORS.RoyalBlueViolet,
    },
    iconContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoadingAnimation;
