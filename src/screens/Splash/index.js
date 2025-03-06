import React, { useEffect } from 'react';
import { Image, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { COLORS, Images } from '../../../constants';
import { retrieveDataFromAsyncStorage } from '../../utils/Helper';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from '../../components/Pixel/Index';
import logger from '../../utils/logger'; // Structured logging
import { LOGIN_SUCCESS } from '../../redux/Actions';

const Splash = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleUserAuthentication = async () => {
        try {
            const cachedUserData = await retrieveDataFromAsyncStorage('userData');

            if (cachedUserData && Object.keys(cachedUserData).length > 0) {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: { userData: cachedUserData },
                });
                navigation.reset({ index: 0, routes: [{ name: 'TabStack' }] });
            } else {
                logger.warn('No user data found, redirecting to Welcome screen.');
                navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
            }
        } catch (error) {
            logger.error('Error during user authentication:', error);
            navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handleUserAuthentication();
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLORS.tertiaryWhite} barStyle="dark-content" />
            <View style={styles.logoContainer}>
                <Image source={Images.travelLoggerLogo} style={styles.logo} resizeMode="contain" />
            </View>
        </SafeAreaView>
    );
};

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.tertiaryWhite,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        width: wp(80),
        height: hp(50),
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
});
