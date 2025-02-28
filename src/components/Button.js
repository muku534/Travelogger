import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from './Pixel/Index';
import { COLORS } from '../../constants';
import fontFamily from '../../constants/fontFamily';

const Button = ({ title, onPress, color, disabled, loading, style }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: disabled ? COLORS.gray : color || COLORS.primary },
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
                <Text style={styles.buttonText}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: hp(6),
        width: wp(90),
        borderRadius: wp(3),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp(5),
    },
    buttonText: {
        fontSize: hp(2.2),
        color: COLORS.white,
        fontFamily: fontFamily.FONTS.Medium
    },
});

export default Button;
