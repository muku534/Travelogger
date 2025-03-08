import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { googleLogin } from './authService';
import { storeDataInAsyncStorage } from '../utils/Helper';
import { LOGIN_SUCCESS } from '../redux/Actions';
import logger from '../utils/logger';
import Toast from 'react-native-toast-message';

export const signInWithGoogle = async (navigation, dispatch) => {
    try {
        GoogleSignin.configure({
            webClientId: '181504532584-8o1jdaa0cn6ves6tb1oj1p74u6hc85kc.apps.googleusercontent.com',
            offlineAccess: true,
            prompt: 'select_account',
            scopes: ['profile', 'email'],
        });

        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        console.log("this is the userInfo:", userInfo);

        // ✅ Correctly extract idToken whether it's inside `data` or not
        const idToken = userInfo?.data?.idToken || userInfo?.idToken;

        if (!idToken) {
            throw new Error("Failed to retrieve ID Token from Google.");
        }

        console.log("this is the idToken:", idToken);

        Toast.show({ type: 'info', text1: 'Authenticating...', text2: 'Please wait' });

        // ✅ Ensure correct idToken format
        const response = await googleLogin({ idToken });

        console.log("API response", response);

        Toast.show({
            type: 'success',
            text1: response.message || "Authentication Successful",
            text2: 'Redirecting to Home...'
        });

        await storeDataInAsyncStorage("userData", response);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: { userData: response },
        });

        navigation.reset({ index: 0, routes: [{ name: 'TabStack' }] });

    } catch (error) {
        Toast.show({ type: 'error', text1: 'Google Sign-In Failed', text2: error.message || "Something went wrong!" });
        console.log("Google Sign-In Error:", error);
    }
};


