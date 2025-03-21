import { GOOGLE_CLOUD_API } from "@env";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { googleLogin } from './authService';
import { storeDataInAsyncStorage } from '../utils/Helper';
import { LOGIN_SUCCESS } from '../redux/Actions';
import logger from '../utils/logger';
import Toast from 'react-native-toast-message';

export const signInWithGoogle = async (navigation, dispatch) => {
    try {

        // Configure Google Sign-In
        GoogleSignin.configure({
            webClientId: GOOGLE_CLOUD_API,
            offlineAccess: true,
            prompt: 'select_account', // Always prompt to select an account
            scopes: ['profile', 'email'],
        });

        // Ensure Google Play Services are available
        await GoogleSignin.hasPlayServices();

        // Sign out first to always show "Select Account" screen
        await GoogleSignin.signOut();

        // Now proceed with sign-in
        const userInfo = await GoogleSignin.signIn();
        const { idToken } = await GoogleSignin.getTokens();

        // Show toast message before starting the sign-in process
        Toast.show({
            type: 'info',
            text1: 'Signing in...',
            text2: 'Please wait...',
            visibilityTime: 2000, // Show for 2 seconds
            autoHide: true,
        });
        // Send token to backend
        const response = await googleLogin({ idToken });

        if (response?.status === 200) {
            Toast.show({
                type: 'success',
                text1: "Authentication Successful",
                text2: 'Redirecting to Home...'
            });
            await storeDataInAsyncStorage("userData", response);
            dispatch({ type: LOGIN_SUCCESS, payload: { userData: response } });
            navigation.reset({ index: 0, routes: [{ name: 'TabStack' }] });
        } else if (response?.status === 401 || response?.status === 409 || response?.status === 400) {
            Toast.show({
                type: 'info',
                text1: 'User already exists or Unauthorized',
                text2: 'Redirecting to Login...'
            });
            navigation.navigate("Login")
        } else {
            Toast.show({
                type: 'error',
                text1: 'Authentication Failed',
                text2: 'Something went wrong!'
            });
        }
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Google Sign-In Failed',
            text2: "Something went wrong!"
        });
    }
};
