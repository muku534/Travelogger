import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { ErrorBoundary } from 'react-error-boundary';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../components/Pixel/Index'

const ErrorFallback = ({ error, resetErrorBoundary }) => (
    <View style={styles.container}>
        <Text style={styles.errorText}>Something went wrong!</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <Button title="Try Again" onPress={resetErrorBoundary} />
    </View>
);

const GlobalErrorBoundary = ({ children }) => (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
        {children}
    </ErrorBoundary>
);

export default GlobalErrorBoundary;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp(5), // Responsive padding
    },
    errorText: {
        fontSize: hp(2.5), // Responsive font size
        fontWeight: 'bold',
        color: 'red',
    },
    errorMessage: {
        marginTop: hp(1), // Responsive margin
        fontSize: hp(2),
        textAlign: 'center',
        width: wp(80), // Responsive width
    },
});
