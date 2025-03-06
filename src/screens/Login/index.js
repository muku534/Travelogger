import React, { useState } from 'react';
import { View, Text, TextInput, ImageBackground, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../components/Pixel/Index';
import { COLORS, Images, SVGS } from '../../../constants';
import Button from '../../components/Button';
import fontFamily from '../../../constants/fontFamily';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { useDispatch } from 'react-redux';
import { login } from '../../services/authService';
import { storeDataInAsyncStorage } from '../../utils/Helper';
import { LOGIN_SUCCESS } from '../../redux/Actions';
import Toast from 'react-native-toast-message';

const Login = ({ navigation }) => {
    const dispatch = useDispatch(); // Initialize dispatch
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => {
        setForm(prevState => ({ ...prevState, [key]: value }));
    };

    const handleLogin = async () => {
        const { email, password } = form;

        // Check if email or password is empty
        if (!email || !password) {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: 'Please fill in both email and password.',
                position: 'top'
            });
            return;
        }

        setLoading(true);
        try {
            // Call the login API
            const response = await login(email, password);

            await storeDataInAsyncStorage("userData", response)
            // Dispatch the login success action to update Redux state
            dispatch({
                type: LOGIN_SUCCESS,
                payload: { userData: response },
            });

            Toast.show({
                type: 'success',
                text1: 'Login Successful',
                text2: 'Welcome back to Travelogger!',
                position: 'top'
            });

            // Navigate to the home or dashboard screen
            navigation.reset({ index: 0, routes: [{ name: 'TabStack' }] });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error.message || "Something went wrong.",
                position: 'top'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        {/* Background Image */}
                        <ImageBackground
                            source={Images.loginTitle}
                            style={styles.backgroundImage}
                            resizeMode="cover"
                        >
                            <View style={styles.textContainer}>
                                <Text style={styles.headerText}>
                                    Join with us, <Text style={styles.brandText}>Travelogger</Text>
                                </Text>
                            </View>
                        </ImageBackground>

                        {/* Login Form */}
                        <View style={styles.formContainer}>
                            <Text style={styles.loginTitle}>Login Now</Text>
                            <Text style={styles.loginSubtitle}>Enter your Registered Email and Password to Explore the App</Text>

                            {/* Email Input */}
                            <View>
                                <View style={styles.inputContainer}>
                                    <SVGS.EMAIL width={hp(2.6)} height={hp(2.6)} />
                                    <TextInput
                                        placeholder='Email ID'
                                        placeholderTextColor={COLORS.darkgray}
                                        keyboardType='email-address'
                                        style={styles.input}
                                        value={form.email}
                                        onChangeText={(text) => handleChange('email', text)}
                                        editable={!loading}
                                    />
                                </View>
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputContainer}>
                                <MaterialCommunityIcons name="lock-outline" size={hp(3)} color={COLORS.darkgray1} style={{ paddingRight: wp(1) }} />
                                <TextInput
                                    placeholder='Password'
                                    placeholderTextColor={COLORS.darkgray}
                                    keyboardType='default'
                                    secureTextEntry={isPasswordShown}
                                    style={styles.input}
                                    value={form.password}
                                    onChangeText={(text) => handleChange('password', text)}
                                    editable={!loading}
                                />

                                <TouchableOpacity
                                    onPress={() => setIsPasswordShown(!isPasswordShown)}
                                    style={{
                                        position: 'absolute',
                                        right: 12,
                                    }}
                                >
                                    {
                                        isPasswordShown ? (
                                            <MaterialIcons name="visibility-off" size={24} color={COLORS.darkgray1} />
                                        ) : (
                                            <MaterialIcons name="visibility" size={24} color={COLORS.darkgray1} />
                                        )
                                    }

                                </TouchableOpacity>
                            </View>

                            {/* Forgot Password */}
                            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('ForgotPassword')}>
                                <Text style={styles.forgotPassword}>Forgot Password?</Text>
                            </TouchableOpacity>

                            {/* Login Button */}
                            <Button
                                title="Login Now"
                                onPress={handleLogin}
                                disabled={loading}
                                loading={loading}
                                style={styles.loginButton}
                            />

                            {/* Signup Navigation */}
                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: hp(2) }}>
                                <Text style={styles.signupText}>Didn’t have an Account?</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('SignUp')} activeOpacity={0.7}>
                                    <Text style={styles.signupBold}> Create Account</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    backgroundImage: {
        width: '100%',
        height: hp(50), // Proper height for good image visibility
        justifyContent: 'flex-end',
        position: 'relative',
    },
    textContainer: {
        position: 'absolute',
        bottom: hp(1.5), // Adjust position over the overlay
        left: wp(5),
    },
    headerText: {
        fontSize: wp(6),
        color: COLORS.white,
        fontFamily: fontFamily.FONTS.Medium,
    },
    brandText: {
        color: COLORS.red,
        fontFamily: fontFamily.FONTS.bold,
    },
    formContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingHorizontal: wp(6),
        paddingTop: hp(2),
    },
    loginTitle: {
        fontSize: wp(6),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.darkgray,
        textAlign: 'center',
        marginBottom: hp(1),
    },
    loginSubtitle: {
        fontSize: wp(4),
        color: COLORS.darkgray1,
        textAlign: 'center',
        marginBottom: hp(2),
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(1),
        height: hp(6),
        borderColor: COLORS.Midgray,
        borderWidth: 0.5,
        borderRadius: wp(2),
        paddingLeft: wp(2),
    },
    input: {
        flex: 1,
        color: COLORS.darkgray,
    },
    icon: {
        width: wp(6),
        height: wp(6),
        resizeMode: 'contain',
        tintColor: COLORS.gray,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.Medium,
        fontSize: hp(1.8),
        marginVertical: hp(1)
    },
    signupText: {
        fontSize: wp(4.5),
        color: COLORS.darkgray,
        fontFamily: fontFamily.FONTS.Medium
    },
    signupBold: {
        fontSize: wp(4.5),
        fontFamily: fontFamily.FONTS.bold,
        color: COLORS.red,
    },
});
