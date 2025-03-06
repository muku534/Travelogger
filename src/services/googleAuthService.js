import { FIREBASE_WEB_CLIENT_ID } from '@env';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { googleLogin, signUp } from './authService';
import { storeDataInAsyncStorage } from '../utils/Helper';
import { LOGIN_SUCCESS } from '../redux/Actions';
import logger from '../utils/logger';
import Toast from 'react-native-toast-message';

export const signInWithGoogle = async (navigation, dispatch) => {
    try {
        GoogleSignin.configure({
            webClientId: FIREBASE_WEB_CLIENT_ID,
            offlineAccess: false,
            scopes: ['profile', 'email'],
        });

        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        console.log("Google Sign-In UserInfo:", userInfo);

        // Correctly extract the idToken and user details
        const { idToken } = userInfo.data;
        const user = userInfo.data.user;

        if (!idToken) {
            throw new Error("Google Sign-In failed, no ID token received.");
        }

        // Authenticate with Firebase
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        const userCredential = await auth().signInWithCredential(googleCredential);

        console.log("Firebase Authentication Successful:", userCredential);

        // Construct user data for API call
        const userData = {
            name: user.name || "Unknown User",
            email: user.email,
            password: "",
            createdBy: "Google",
            avatarImgUrl: user.photo ||
                `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${user.name || "User"}&backgroundColor=b6e3f4`,
        };

        Toast.show({ type: 'info', text1: 'Registering user...', text2: 'Please wait' })

        // Call backend API to store user in your database
        const response = await signUp(userData);

        if (!response) {
            throw new Error("Failed to authenticate with backend.");
        }

        Toast.show({ type: 'success', text1: 'Sign-Up Successful', text2: 'Redirecting to Home...' });

        // Store user data locally
        await storeDataInAsyncStorage("userData", response);

        // Dispatch Redux action
        dispatch({
            type: LOGIN_SUCCESS,
            payload: { userData: response },
        });

        // Navigate to the home screen
        navigation.reset({ index: 0, routes: [{ name: 'TabStack' }] });

    } catch (error) {
        Toast.show({ type: 'error', text1: 'Google Sign-In Failed', text2: error.message || "Something went wrong!" });
        logger.error("Google Sign-In Error:", error);
    }
};
