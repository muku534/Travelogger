import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from './Pixel/Index';
import { COLORS } from '../../constants';
import fontFamily from '../../constants/fontFamily';
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet();

const Button = ({ title, onPress, disabled, loading }) => {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.5}
        >
            {loading ? (
                <ActivityIndicator color={COLORS.white} size="large" />
            ) : (
                <Text style={styles.buttonText}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: hp(6),
        width: isTablet ? wp(50) : wp(90),
        borderRadius: isTablet ? wp(1) : wp(3),
        marginHorizontal: isTablet ? wp(20) : wp(0),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp(5),
        backgroundColor: COLORS.red,
    },
    buttonText: {
        fontSize: hp(2.2),
        color: COLORS.white,
        fontFamily: fontFamily.FONTS.Medium
    },
});

export default Button;
