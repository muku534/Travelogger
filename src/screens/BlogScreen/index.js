import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../components/Pixel/Index';
import { COLORS } from '../../../constants';

const BlogScreen = ({ route }) => {
    const { blogUrl } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLORS.red} barStyle={'dark-content'} />
            <WebView source={{ uri: blogUrl }} style={styles.webView} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,  // Ensures the SafeAreaView fills the screen
    },
    webView: {
        flex: 1,
        marginTop: hp(5)
    },
});

export default BlogScreen;
