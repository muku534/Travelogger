import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import { Alert } from 'react-native';
import log from './logger';

// ✅ Ensure function safety
setJSExceptionHandler((error, isFatal) => {
    if (!error) return; 

    log.error('JS Error:', error); 

    if (isFatal) {
        Alert.alert(
            'Unexpected Error',
            'An unexpected error occurred. Please restart the app.',
            [{ text: 'OK' }]
        );
    }
}, true);

// ✅ Ensure native exception handler exists
if (setNativeExceptionHandler) {
    setNativeExceptionHandler((errorString) => {
        if (!errorString) return;
        log.error('Native Crash:', errorString);
    });
} else {
    console.warn("setNativeExceptionHandler is not available");
}
