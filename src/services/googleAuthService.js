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
        const { idToken, accessToken } = await GoogleSignin.getTokens();

        console.log("this is the userInfo:", userInfo);
        console.log("this is the idToken:", idToken);
        console.log("this is the accessToken:", accessToken);

        const response = await googleLogin({ idToken });

        console.log("API response", response);

        if (response?.status === 200) {
            Toast.show({
                type: 'success',
                text1: response.message || "Authentication Successful",
                text2: 'Redirecting to Home...'
            });

            await storeDataInAsyncStorage("userData", response);
            dispatch({ type: LOGIN_SUCCESS, payload: { userData: response } });
            navigation.reset({ index: 0, routes: [{ name: 'TabStack' }] });
        } else if (response?.status === 401 || response?.status === 409) {
            Toast.show({
                type: 'info',
                text1: 'User already exists or Unauthorized',
                text2: 'Redirecting to Login...'
            });
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        } else {
            Toast.show({
                type: 'error',
                text1: 'Authentication Failed',
                text2: response?.message || 'Something went wrong!'
            });
        }
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Google Sign-In Failed',
            text2: error.message || "Something went wrong!"
        });
        console.log("Google Sign-In Error:", error);
    }
};
