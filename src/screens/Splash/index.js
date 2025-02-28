import React, { useEffect } from 'react';
import { Image, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { COLORS, Images } from '../../../constants'; // Import centralized constants
import { retrieveDataFromAsyncStorage } from '../../utils/Helper';
import { loginUser } from '../../redux/Actions';

const Splash = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleUserAuthentication = async () => {
        try {
            const cachedUserData = await retrieveDataFromAsyncStorage('userData');

            if (cachedUserData && Object.keys(cachedUserData).length > 0) {
                dispatch(loginUser(cachedUserData));
                console.log('✅ Cached user data found:', cachedUserData);
                navigation.reset({ index: 0, routes: [{ name: 'TabStack' }] });
            } else {
                console.log('⚠️ No user data found, redirecting to Welcome screen.');
                navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
            }
        } catch (error) {
            console.error('❌ Error during user authentication:', error);
            navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        }
    };

    // Effect to trigger user authentication
    useEffect(() => {
        const timer = setTimeout(() => {
            handleUserAuthentication();
        }, 800); // Delay to show the splash screen animation

        return () => clearTimeout(timer); // Clean up the timer
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLORS.tertiaryWhite} barStyle="dark-content" />
            <View style={styles.logoContainer}>
                <Image
                    source={Images.travelLoggerLogo} // Use Images constant
                    style={styles.logo}
                    resizeMode="contain"
                />
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
        width: '80%',
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
});
