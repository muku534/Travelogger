import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { heightPercentageToDP as hp } from "../../components/Pixel/Index";
import { COLORS } from "../../../constants";

const BlogScreen = ({ route, navigation }) => {
    const { blogUrl } = route.params;

    useEffect(() => {
        const handleBackPress = () => {
            navigation.goBack(); // Navigate back to the previous screen
            return true; // Prevent default behavior (exiting app)
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => backHandler.remove(); // ✅ Correct way to remove listener
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
            <WebView source={{ uri: blogUrl }} style={styles.webView} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    webView: {
        flex: 1,
        marginVertical: hp(5),
    },
});

export default BlogScreen;
