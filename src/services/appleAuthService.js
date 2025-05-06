import { appleAuth } from '@invertase/react-native-apple-authentication';
import { appleLogin } from './authService';
import { storeDataInAsyncStorage } from '../utils/Helper';
import { LOGIN_SUCCESS } from '../redux/Actions';
import Toast from 'react-native-toast-message';
import logger from '../utils/logger';

export const signInWithApple = async (navigation, dispatch) => {
    try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        const {
            user,
            email,
            fullName,
            identityToken,
            authorizationCode,
        } = appleAuthRequestResponse;

        if (!identityToken) {
            throw new Error("Apple Sign-In failed: No identity token returned");
        }

        // Optional: Toast before backend call
        Toast.show({
            type: 'info',
            text1: 'Signing in...',
            text2: 'Please wait...',
        });

        // const response = await appleLogin({ identityToken, authorizationCode });

     
        
    } catch (error) {
        logger.error('Apple Sign-In Error:', error);
        Toast.show({
            type: 'error',
            text1: 'Apple Sign-In Failed',
            text2: 'Something went wrong!'
        });
    }
};
